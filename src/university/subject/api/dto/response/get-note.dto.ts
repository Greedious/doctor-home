import { Notes } from 'src/university/task/data/task.schema';

export class GetNotes {
  studentNotes: string[];
  teacherNotes: string[];
  constructor({ notes }: { notes: Notes[] }) {
    this.studentNotes = [];
    this.teacherNotes = [];
    notes.map((note) => {
      if (note.studentNotes) {
        this.studentNotes.push(note.studentNotes);
      }
      if (note.teacherNotes) {
        this.teacherNotes.push(note.teacherNotes);
      }
    });
  }

  toObject(): {
    studentNotes: string[];
    teacherNotes: string[];
  } {
    return {
      studentNotes: this.studentNotes,
      teacherNotes: this.teacherNotes,
    };
  }
}
