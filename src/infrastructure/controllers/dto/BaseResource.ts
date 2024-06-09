
export interface SchemaSimpleProperty {
  type: 'string' | 'number' | 'boolean';
}

export interface SchemaObjectProperty {
  type: 'object';
  properties: {
    [key: string]: Schema;
  };
  required: string[]; // TODO: infer based on keyof['properties']
}

export interface SchemaArrayProperty {
  type: 'array';
  items: Schema;
}

export type Schema = SchemaSimpleProperty | SchemaObjectProperty | SchemaArrayProperty;

export interface Link {
  rel: string;
  href: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  schema?: Schema; // TODO: only if POST or PUT or PATCH
}

export type DtoWithLinks<T> = T & { _links: Link[] };

export default abstract class BaseResource<T> {

  private _links: Link[] = [];
  protected _dto: T;

  public addLink(link: Link, options?: { condition: boolean }): this {
    if (options?.condition === false) {
      return this;
    }

    this._links.push(link);
    return this;
  }

  public getDtoWithLinks(): DtoWithLinks<T> {
    return {
      ...this._dto,
      _links: this._links,
    };
  }
}