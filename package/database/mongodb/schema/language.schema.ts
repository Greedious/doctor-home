import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: false, _id: false })
export class Language {
  @Prop({ type: String })
  en: string;
  @Prop({ type: String })
  ar: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
