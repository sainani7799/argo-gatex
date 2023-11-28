import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProjectService } from "./project.service ";

@Controller('project')
@ApiTags('project')

export class ProjectController {
  constructor(private readonly service: ProjectService) { }

  @Post('getAllProjects')
  async getAllProjects(): Promise<any> {
    try {
      return await this.service.getAllProjects();
    } catch (error) {
      return (error);
    }
  }
}