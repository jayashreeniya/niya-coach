import { 
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

interface ChatMessage {
  userId: string;
  message: string;
  timestamp: Timestamp;
  isUser: boolean;
}

export const saveMessage = async (userId: string, message: string, isUser: boolean) => {
  try {
    await addDoc(collection(db, 'conversations'), {
      userId,
      message,
      timestamp: Timestamp.now(),
      isUser
    });
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const getUserConversations = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as ChatMessage);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
}; 