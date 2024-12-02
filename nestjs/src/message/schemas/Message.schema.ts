import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Message {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Chat' })
    chat: mongoose.Schema.Types.ObjectId; 
  
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    sender: mongoose.Schema.Types.ObjectId; 
  
    @Prop({ required: true })
    text: string; 
}
export const MessageSchema = SchemaFactory.createForClass(Message);