import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Message {
  id: string;
  messageNumber: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'general' | 'support' | 'complaint' | 'suggestion' | 'order_inquiry' | 'business';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'replied' | 'resolved' | 'archived';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  repliedAt?: string;
  resolvedAt?: string;
  adminNotes?: string;
  reply?: string;
  attachments?: {
    id: string;
    filename: string;
    url: string;
    size: number;
    type: string;
  }[];
}

interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

interface MessagesContextType extends MessagesState {
  getMessageById: (id: string) => Message | undefined;
  markAsRead: (id: string) => Promise<boolean>;
  markAsUnread: (id: string) => Promise<boolean>;
  updateMessageStatus: (id: string, status: Message['status']) => Promise<boolean>;
  addReply: (id: string, reply: string) => Promise<boolean>;
  addAdminNotes: (id: string, notes: string) => Promise<boolean>;
  searchMessages: (query: string, status?: string, category?: string, priority?: string, dateFrom?: string, dateTo?: string) => Message[];
  getMessageStats: () => {
    total: number;
    unread: number;
    read: number;
    replied: number;
    resolved: number;
    archived: number;
    highPriority: number;
    urgent: number;
  };
  archiveMessage: (id: string) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  refreshMessages: () => Promise<void>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

interface MessagesProviderProps {
  children: ReactNode;
}

// Mock messages data - in production, this would come from your backend API
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    messageNumber: 'MSG-2025-0001',
    name: 'أحمد محمد السالم',
    email: 'ahmed.salem@example.com',
    phone: '+965 55123456',
    subject: 'استفسار عن دليل الحيوانات الأليفة',
    message: 'السلام عليكم، أود الاستفسار عن دليل الحيوانات الأليفة الشامل. هل يتضمن معلومات عن تربية القطط والكلاب؟ وما هي الطرق المتاحة للدفع؟ شكراً لكم.',
    category: 'general',
    priority: 'medium',
    status: 'unread',
    isRead: false,
    createdAt: '2025-01-06T10:30:00.000Z',
    updatedAt: '2025-01-06T10:30:00.000Z'
  },
  {
    id: '2',
    messageNumber: 'MSG-2025-0002',
    name: 'فاطمة الكندري',
    email: 'fatima.kandari@example.com',
    phone: '+965 66789123',
    subject: 'مشكلة في التحميل',
    message: 'مرحباً، قمت بشراء دليل تجميع العملات الذهبية ولكن لم أتمكن من تحميله. رقم الطلب ORD-2025-0003. أرجو المساعدة في أسرع وقت ممكن.',
    category: 'support',
    priority: 'high',
    status: 'read',
    isRead: true,
    createdAt: '2025-01-05T15:45:00.000Z',
    updatedAt: '2025-01-05T16:20:00.000Z',
    readAt: '2025-01-05T16:20:00.000Z',
    adminNotes: 'تم التحقق من الطلب - مشكلة في نظام التحميل'
  },
  {
    id: '3',
    messageNumber: 'MSG-2025-0003',
    name: 'خالد العنزي',
    email: 'khalid.enezi@example.com',
    subject: 'طلب استرداد',
    message: 'أطلب استرداد قيمة الطلب رقم ORD-2025-0005 بسبب عدم رضاي عن المحتوى. تم الشراء قبل 3 أيام.',
    category: 'complaint',
    priority: 'high',
    status: 'replied',
    isRead: true,
    createdAt: '2025-01-04T09:15:00.000Z',
    updatedAt: '2025-01-04T14:30:00.000Z',
    readAt: '2025-01-04T09:30:00.000Z',
    repliedAt: '2025-01-04T14:30:00.000Z',
    reply: 'شكراً لك على تواصلك معنا. تم مراجعة طلبك وسيتم معالجة عملية الاسترداد خلال 3-5 أيام عمل. ستصلك رسالة تأكيد على بريدك الإلكتروني.',
    adminNotes: 'استرداد مبرر - تم الموافقة'
  },
  {
    id: '4',
    messageNumber: 'MSG-2025-0004',
    name: 'نورا الحسن',
    email: 'nora.hassan@example.com',
    phone: '+965 77234567',
    subject: 'اقتراح منتج جديد',
    message: 'مرحباً، أقترح إضافة دليل لبناء المزارع المائية في Roblox. أعتقد أنه سيكون مفيداً جداً للاعبين. هل يمكن النظر في هذا الاقتراح؟',
    category: 'suggestion',
    priority: 'medium',
    status: 'resolved',
    isRead: true,
    createdAt: '2025-01-03T11:20:00.000Z',
    updatedAt: '2025-01-03T16:45:00.000Z',
    readAt: '2025-01-03T11:35:00.000Z',
    repliedAt: '2025-01-03T14:20:00.000Z',
    resolvedAt: '2025-01-03T16:45:00.000Z',
    reply: 'شكراً لك على الاقتراح الرائع! سنأخذه في الاعتبار عند تطوير المنتجات الجديدة. نقدر اهتمامك ومساهمتك في تحسين خدماتنا.',
    adminNotes: 'اقتراح جيد - تم إضافته لقائمة المنتجات المستقبلية'
  },
  {
    id: '5',
    messageNumber: 'MSG-2025-0005',
    name: 'سعد الظفيري',
    email: 'saad.dhafiri@example.com',
    phone: '+965 99887766',
    subject: 'استفسار عن خدمة الاستشارة الشخصية',
    message: 'السلام عليكم، أود معرفة تفاصيل أكثر عن خدمة الاستشارة الشخصية. كم تستغرق الجلسة؟ وهل يمكن تحديد موعد مناسب؟',
    category: 'order_inquiry',
    priority: 'medium',
    status: 'unread',
    isRead: false,
    createdAt: '2025-01-06T08:00:00.000Z',
    updatedAt: '2025-01-06T08:00:00.000Z'
  },
  {
    id: '6',
    messageNumber: 'MSG-2025-0006',
    name: 'مريم البلوشي',
    email: 'mariam.balushi@example.com',
    subject: 'طلب شراكة تجارية',
    message: 'مرحباً، أمثل شركة متخصصة في الألعاب التعليمية وأود مناقشة إمكانية شراكة تجارية لتوزيع منتجاتكم. يرجى التواصل معي لمناقشة التفاصيل.',
    category: 'business',
    priority: 'urgent',
    status: 'unread',
    isRead: false,
    createdAt: '2025-01-06T12:15:00.000Z',
    updatedAt: '2025-01-06T12:15:00.000Z',
    attachments: [
      {
        id: 'att1',
        filename: 'company-profile.pdf',
        url: '/uploads/company-profile.pdf',
        size: 2048000,
        type: 'application/pdf'
      }
    ]
  },
  {
    id: '7',
    messageNumber: 'MSG-2025-0007',
    name: 'عبدالله الرشيد',
    email: 'abdullah.rashid@example.com',
    phone: '+965 55998877',
    subject: 'شكر وتقدير',
    message: 'أشكركم على الخدمة الممتازة والمنتجات الرائعة. اشتريت دليل الحيوانات الأليفة وكان مفيداً جداً. أتطلع لمنتجات جديدة منكم.',
    category: 'general',
    priority: 'low',
    status: 'archived',
    isRead: true,
    createdAt: '2025-01-02T14:30:00.000Z',
    updatedAt: '2025-01-02T15:00:00.000Z',
    readAt: '2025-01-02T14:45:00.000Z',
    adminNotes: 'عميل راضي - تقييم إيجابي'
  },
  {
    id: '8',
    messageNumber: 'MSG-2025-0008',
    name: 'لطيفة المطيري',
    email: 'latifa.mutairi@example.com',
    subject: 'مشكلة في الدفع',
    message: 'واجهت مشكلة أثناء الدفع بواسطة KNET. تم خصم المبلغ من حسابي ولكن لم أستلم رسالة تأكيد الطلب. أرجو التحقق من الأمر.',
    category: 'support',
    priority: 'urgent',
    status: 'unread',
    isRead: false,
    createdAt: '2025-01-06T16:20:00.000Z',
    updatedAt: '2025-01-06T16:20:00.000Z'
  }
];

export const MessagesProvider: React.FC<MessagesProviderProps> = ({ children }) => {
  const [messagesState, setMessagesState] = useState<MessagesState>({
    messages: [],
    isLoading: true,
    error: null,
  });

  const refreshMessages = async (): Promise<void> => {
    setMessagesState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, this would be an API call to fetch messages
      const savedMessages = localStorage.getItem('admin_messages');
      const messages = savedMessages ? JSON.parse(savedMessages) : INITIAL_MESSAGES;
      
      setMessagesState({
        messages,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setMessagesState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load messages',
      }));
    }
  };

  const getMessageById = (id: string): Message | undefined => {
    return messagesState.messages.find(message => message.id === id);
  };

  const markAsRead = async (id: string): Promise<boolean> => {
    try {
      const updatedMessages = messagesState.messages.map(message => 
        message.id === id 
          ? { 
              ...message, 
              isRead: true,
              status: message.status === 'unread' ? 'read' : message.status,
              readAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : message
      );

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
      
      setMessagesState(prev => ({
        ...prev,
        messages: updatedMessages,
      }));

      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  };

  const markAsUnread = async (id: string): Promise<boolean> => {
    try {
      const updatedMessages = messagesState.messages.map(message => 
        message.id === id 
          ? { 
              ...message, 
              isRead: false,
              status: 'unread',
              readAt: undefined,
              updatedAt: new Date().toISOString()
            }
          : message
      );

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
      
      setMessagesState(prev => ({
        ...prev,
        messages: updatedMessages,
      }));

      return true;
    } catch (error) {
      console.error('Error marking message as unread:', error);
      return false;
    }
  };

  const updateMessageStatus = async (id: string, status: Message['status']): Promise<boolean> => {
    try {
      const updatedMessages = messagesState.messages.map(message => 
        message.id === id 
          ? { 
              ...message, 
              status, 
              updatedAt: new Date().toISOString(),
              resolvedAt: status === 'resolved' ? new Date().toISOString() : message.resolvedAt
            }
          : message
      );

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
      
      setMessagesState(prev => ({
        ...prev,
        messages: updatedMessages,
      }));

      return true;
    } catch (error) {
      console.error('Error updating message status:', error);
      return false;
    }
  };

  const addReply = async (id: string, reply: string): Promise<boolean> => {
    try {
      const updatedMessages = messagesState.messages.map(message => 
        message.id === id 
          ? { 
              ...message, 
              reply,
              status: 'replied',
              repliedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : message
      );

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
      
      setMessagesState(prev => ({
        ...prev,
        messages: updatedMessages,
      }));

      return true;
    } catch (error) {
      console.error('Error adding reply:', error);
      return false;
    }
  };

  const addAdminNotes = async (id: string, notes: string): Promise<boolean> => {
    try {
      const updatedMessages = messagesState.messages.map(message => 
        message.id === id 
          ? { 
              ...message, 
              adminNotes: notes,
              updatedAt: new Date().toISOString()
            }
          : message
      );

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
      
      setMessagesState(prev => ({
        ...prev,
        messages: updatedMessages,
      }));

      return true;
    } catch (error) {
      console.error('Error adding admin notes:', error);
      return false;
    }
  };

  const archiveMessage = async (id: string): Promise<boolean> => {
    try {
      const updatedMessages = messagesState.messages.map(message => 
        message.id === id 
          ? { 
              ...message, 
              status: 'archived',
              updatedAt: new Date().toISOString()
            }
          : message
      );

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
      
      setMessagesState(prev => ({
        ...prev,
        messages: updatedMessages,
      }));

      return true;
    } catch (error) {
      console.error('Error archiving message:', error);
      return false;
    }
  };

  const deleteMessage = async (id: string): Promise<boolean> => {
    try {
      const updatedMessages = messagesState.messages.filter(message => message.id !== id);

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
      
      setMessagesState(prev => ({
        ...prev,
        messages: updatedMessages,
      }));

      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  };

  const searchMessages = (
    query: string, 
    status?: string, 
    category?: string, 
    priority?: string,
    dateFrom?: string, 
    dateTo?: string
  ): Message[] => {
    let filtered = messagesState.messages;

    // Filter by status
    if (status && status !== 'all') {
      filtered = filtered.filter(message => message.status === status);
    }

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(message => message.category === category);
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      filtered = filtered.filter(message => message.priority === priority);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(message => new Date(message.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(message => new Date(message.createdAt) <= new Date(dateTo));
    }

    // Filter by search query
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(message => 
        message.messageNumber.toLowerCase().includes(searchTerm) ||
        message.name.toLowerCase().includes(searchTerm) ||
        message.email.toLowerCase().includes(searchTerm) ||
        message.subject.toLowerCase().includes(searchTerm) ||
        message.message.toLowerCase().includes(searchTerm) ||
        (message.phone && message.phone.includes(searchTerm))
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getMessageStats = () => {
    const messages = messagesState.messages;
    return {
      total: messages.length,
      unread: messages.filter(m => m.status === 'unread').length,
      read: messages.filter(m => m.status === 'read').length,
      replied: messages.filter(m => m.status === 'replied').length,
      resolved: messages.filter(m => m.status === 'resolved').length,
      archived: messages.filter(m => m.status === 'archived').length,
      highPriority: messages.filter(m => m.priority === 'high').length,
      urgent: messages.filter(m => m.priority === 'urgent').length
    };
  };

  useEffect(() => {
    refreshMessages();
  }, []);

  const value: MessagesContextType = {
    ...messagesState,
    getMessageById,
    markAsRead,
    markAsUnread,
    updateMessageStatus,
    addReply,
    addAdminNotes,
    searchMessages,
    getMessageStats,
    archiveMessage,
    deleteMessage,
    refreshMessages,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};

export default MessagesProvider;