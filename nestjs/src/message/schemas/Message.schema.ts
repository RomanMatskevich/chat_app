import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Message {
    @Prop({ required: true, type: String, ref: 'Chat' })
    chat: string; 
  
    @Prop({ required: true, type: String, ref: 'User' })
    sender: string; 
  
    @Prop({ required: true })
    text: string; 
}

export const MessageSchema = SchemaFactory.createForClass(Message);