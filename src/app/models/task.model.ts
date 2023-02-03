export interface TaskModel {
  readonly name: string;
  readonly categoryId: string;
  readonly id: string;
  readonly imageUrl?: string;
  readonly teamMemberIds?: string[];
}
