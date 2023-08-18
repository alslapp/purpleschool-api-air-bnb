import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/gards';
import { FileElementResponse } from './dto/file-response-element.response';
import { FilesService } from './files.service';
import { MFile } from './mfile.class';
import { Roles } from '../decorators';
import { Role } from '../user/dto/user-roles.enum';

@Controller('files')
export class FilesController {
	widthResize = 500;
	constructor(private readonly filesService: FilesService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Roles(Role.ADMIN)
	@UseInterceptors(FileInterceptor('files'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
	): Promise<FileElementResponse[] | null> {
		const fileNameArr = file.originalname.split('.');
		const ext = fileNameArr.pop();
		// const fileName = fileNameArr.join('.');
		const buffer = file.buffer;
		const fileNameHash = this.filesService.getHashFile(buffer).substring(0, 15);

		// original file
		const saveArray: MFile[] = [
			new MFile({
				originalname: `${fileNameHash}.${ext}`,
				buffer,
			}),
		];

		if (file.mimetype.includes('image')) {
			const { width } = await this.filesService.getMetadata(buffer);

			// convert to webp
			const webp = await this.filesService.convertToWebP(buffer);
			saveArray.push(
				new MFile({
					originalname: `${fileNameHash}.webp`,
					buffer: webp,
				}),
			);

			// resize
			if (width && width > this.widthResize) {
				// resize original file
				const resized = await this.filesService.resize(buffer, this.widthResize);
				saveArray.push(
					new MFile({
						originalname: `${fileNameHash}_${this.widthResize}.${ext}`,
						buffer: resized,
					}),
				);

				//resize webp file
				const webpResized = await this.filesService.resize(webp, this.widthResize);
				saveArray.push(
					new MFile({
						originalname: `${fileNameHash}_${this.widthResize}.webp`,
						buffer: webpResized,
					}),
				);
			}
		}
		return this.filesService.saveFiles(saveArray);
	}
}
