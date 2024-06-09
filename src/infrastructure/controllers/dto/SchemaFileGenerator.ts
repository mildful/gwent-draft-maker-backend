import * as fs from 'fs';
import * as path from 'path';
import { JsonSchema7Type } from 'zod-to-json-schema';

export abstract class SchemaFileGenerator {
  public static async generateSchemaFile(): Promise<void> {
    const destPath = path.join(__dirname, '../../../../public/schemas.json');

    const resourceFilePaths = await SchemaFileGenerator.listResourceFiles();
    const jsonSchemas = await SchemaFileGenerator.getJsonSchemasFromResourceFiles(resourceFilePaths);

    fs.writeFileSync(destPath, JSON.stringify(jsonSchemas));
  }

  private static async getJsonSchemasFromResourceFiles(filePaths: string[]): Promise<JsonSchema7Type[]> {
    const allJsonSchemas: JsonSchema7Type[] = [];

    for (const resouceFilePath of filePaths) {
      if (resouceFilePath.endsWith('.ts')) {
        const { JSON_SCHEMAS } = await import(resouceFilePath);
        if (JSON_SCHEMAS) {
          allJsonSchemas.push(...JSON_SCHEMAS);
        }
      }
    }

    return allJsonSchemas;
  }

  private static async listResourceFiles(from = './'): Promise<string[]> {
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


