import { 
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../firebase';

interface EmotionalAnalysis {
  severity: number;
  primaryEmotion: string;
  recommendation: string;
  requiresProfessionalHelp: boolean;
}

interface ChatMessage {
  id?: string;
  userId: string;
  message: string;
  timestamp: Timestamp;
  isUser: boolean;
  language?: string;
  emotionalAnalysis?: EmotionalAnalysis;
}

export const saveMessage = async (
  userId: string,
  message: string,
  isUser: boolean,
  language?: string,
  emotionalAnalysis?: EmotionalAnalysis
): Promise<string> => {
  try {
    console.log('Attempting to save message:', { userId, message, isUser, language, emotionalAnalysis });
    const messagesRef = collection(db, 'messages');
    const docRef = await addDoc(messagesRef, {
      userId,
      message,
      isUser,
      timestamp: Timestamp.now(),
      language,
      emotionalAnalysis
    });
    console.log('Message saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const getUserConversations = async (userId: string): Promise<ChatMessage[]> => {
  if (!userId) {
    throw new Error('User ID is required to fetch conversations');
  }

  try {
    console.log('Fetching conversations for user:', userId);
    const q = query(
      collection(db, 'messages'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Messages fetched:', querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.log('No messages found for user:', userId);
      return [];
    }
    
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    
    // Additional validation to ensure we only return messages for the correct user
    const filteredMessages = messages.filter(msg => msg.userId === userId);
    console.log('Processed messages:', filteredMessages.length);
    
    return filteredMessages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    if (error instanceof FirestoreError) {
      if (error.code === 'permission-denied') {
        throw new Error('You do not have permission to access these messages');
      }
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
    if (error instanceof Error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
    throw new Error('Failed to fetch messages: Unknown error');
  }
}; 