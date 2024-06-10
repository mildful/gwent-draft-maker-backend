import * as fs from 'fs';
import * as path from 'path';
import { JsonSchema7Type } from 'zod-to-json-schema';
import Logger from '../../../domain/models/utils/Logger';

export class SchemaFileGenerator {
  private logger: Logger;
  private destPath: string;

  constructor(logger: Logger, options?: {
    destPath: string;
  }) {
    this.logger = logger;
    this.destPath = options?.destPath || path.join(__dirname, '../../../../public/schemas.json');
  }

  public async generateSchemaFile(): Promise<void> {
    const resourceFilePaths = await this.listResourceFiles();
    const jsonSchemas = await this.getJsonSchemasFromResourceFiles(resourceFilePaths);

    fs.writeFileSync(this.destPath, JSON.stringify(jsonSchemas));
  }

  private async getJsonSchemasFromResourceFiles(filePaths: string[]): Promise<JsonSchema7Type[]> {
    const allJsonSchemas: JsonSchema7Type[] = [];

    for (const resourceFilePath of filePaths) {
      if (resourceFilePath.endsWith('.ts')) {
        const exports = await import(resourceFilePath);

        if (exports.default) {
          try {
            const schemas = exports.default.getJsonSchemas();
            allJsonSchemas.push(...schemas);
          } catch (error) {
            this.logger.info(`[SchemaFileGenerator][getJsonSchemasFromResourceFiles] ${path.basename(resourceFilePath)}: ${error}`);
          }
        } else {
          throw new Error(`No default export found in ${resourceFilePath}`);
        }
      }
    }

    return allJsonSchemas;
  }

  private async listResourceFiles(from = './'): Promise<string[]> {
    const dirents = fs.readdirSync(path.join(__dirname, from), { withFileTypes: true });

    const gellFilesInsideDirectoryPromises = dirents
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        return new Promise<string[]>((resolve, reject) => {
          fs.readdir(path.join(dirent.parentPath, dirent.name), null, (err, fileNames) => {
            if (err) {
              reject(err);
            }
            const filePaths = fileNames.map(fileName => path.join(dirent.parentPath, dirent.name, fileName));
            resolve(filePaths);
          });
        });
      });

    const resoucePaths: string[] = (await Promise.all(gellFilesInsideDirectoryPromises))
      .flat()
      .filter(fileName => fileName.endsWith('Resource.ts'));


    return resoucePaths;
  }
}


