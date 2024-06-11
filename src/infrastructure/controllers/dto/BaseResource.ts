import { JsonSchema7Type } from "zod-to-json-schema";

export interface Link {
  rel: string;
  href: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  schemaRef?: string; // TODO: only if POST or PUT or PATCH
}

export type GenerateLinkFn<T extends BaseResource<any>> = (resourceInstance: T) => Link | null;

export type DtoWithLinks<T> = T & { _links?: Link[] };

export default abstract class BaseResource<T> {
  public static getJsonSchemas(): JsonSchema7Type[] {
    throw new Error('getJsonSchemas is not implemented');
  }

  protected _dto: T;
  private _links: Link[] = [];

  public addLink(linkOrFn: Link | GenerateLinkFn<this>, options?: { condition: boolean }): this {
    let link: Link | null = null;

    if (typeof linkOrFn === 'function') {
      link = linkOrFn(this);
    } else if (typeof linkOrFn === 'object') {
      link = linkOrFn;
    }

    if (options?.condition === false) {
      return this;
    }

    if (link) {
      this._links.push(link);
    }

    return this;
  }

  public getDtoWithLinks(): DtoWithLinks<T> {
    return {
      ...this._dto,
      _links: this._links.length ? this._links : undefined,
    };
  }
}