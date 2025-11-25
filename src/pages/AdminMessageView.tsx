import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMessages, Message } from '@/contexts/MessagesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  Edit, 
  Save, 
  X, 
  Reply, 
  Archive, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Download,
  Eye,
  Star
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminMessageView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { id } = useParams<{ id: string }>();
  const { 
    getMessageById, 
    markAsRead, 
    updateMessageStatus, 
    addReply, 
    addAdminNotes, 
    archiveMessage, 
    deleteMessage 
  } = useMessages();

  const [message, setMessage] = useState<Message | undefined>(undefined);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (id) {
      const foundMessage = getMessageById(id);
      if (foundMessage) {
        setMessage(foundMessage);
        setNewStatus(foundMessage.status);
        setAdminNotes(foundMessage.adminNotes || '');
        
        // Mark as read if not already read
        if (!foundMessage.isRead) {
          markAsRead(id);
        }
      }
    }
  }, [id, getMessageById, markAsRead]);

  const handleStatusSave = async () => {
    if (id && newStatus !== message?.status) {
      const success = await updateMessageStatus(id, newStatus as Message['status']);
      if (success) {
        // Refresh message data
        const updatedMessage = getMessageById(id);
        setMessage(updatedMessage);
      }
    }
    setIsEditingStatus(false);
  };

  const handleNotesSave = async () => {
    if (id && adminNotes !== message?.adminNotes) {
      const success = await addAdminNotes(id, adminNotes);
      if (success) {
        // Refresh message data
        const updatedMessage = getMessageById(id);
        setMessage(updatedMessage);
      }
    }
    setIsEditingNotes(false);
  };

  const handleReplySend = async () => {
    if (id && replyText.trim()) {
      const success = await addReply(id, replyText);
      if (success) {
        // Refresh message data
        const updatedMessage = getMessageById(id);
        setMessage(updatedMessage);
        setReplyText('');
      }
    }
    setIsReplying(false);
  };

  const handleArchive = async () => {
    if (id && confirm('Are you sure you want to archive this message?')) {
      const success = await archiveMessage(id);
      if (success) {
        // Navigate back to messages list
        window.history.back();
      }
    }
  };

  const handleDelete = async () => {
    if (id && confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      const success = await deleteMessage(id);
      if (success) {
        // Navigate back to messages list
        window.history.back();
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800 border-red-200';
      case 'read': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'resolved': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <Mail className="h-4 w-4" />;
      case 'support': return <AlertTriangle className="h-4 w-4" />;
      case 'complaint': return <AlertTriangle className="h-4 w-4" />;
      case 'suggestion': return <Star className="h-4 w-4" />;
      case 'order_inquiry': return <FileText className="h-4 w-4" />;
      case 'business': return <User className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const isArabic = i18n.language === 'ar';

    if (isArabic) {
      return date.toLocaleString('ar-KW-u-ca-gregory', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!message) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading message...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link to="/admin/messages">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Message {message.messageNumber}
                </h1>
                <p className="text-sm text-gray-500">
                  Created on {formatDate(message.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button variant="outline" size="sm" onClick={() => setIsReplying(!isReplying)}>
                <Reply className="h-4 w-4" />
                Reply
              </Button>
              <Button variant="outline" size="sm" onClick={handleArchive}>
                <Archive className="h-4 w-4" />
                Archive
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Message Status
                  </CardTitle>
                  {!isEditingStatus && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingStatus(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditingStatus ? (
                  <div className="space-y-3">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button size="sm" onClick={handleStatusSave}>
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingStatus(false)}>
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Badge className={`${getStatusColor(message.status)} capitalize text-sm`}>
                      {message.status}
                    </Badge>
                    <Badge className={`${getPriorityColor(message.priority)} capitalize text-sm`}>
                      {message.priority} Priority
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Message Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Message Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                      {getCategoryIcon(message.category)}
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {message.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {message.subject}
                    </h3>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {message.message}
                    </p>
                  </div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Attachments</h4>
                      <div className="space-y-2">
                        {message.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{attachment.filename}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply Section */}
                  {message.reply && (
                    <div className="border-t pt-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                          <Reply className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Admin Reply</span>
                          <span className="text-xs text-green-600">
                            {message.repliedAt && formatDate(message.repliedAt)}
                          </span>
                        </div>
                        <p className="text-green-700 whitespace-pre-wrap">
                          {message.reply}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  {isReplying && (
                    <div className="border-t pt-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Write Reply</label>
                        <Textarea
                          placeholder="Type your reply here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={4}
                        />
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Button onClick={handleReplySend} disabled={!replyText.trim()}>
                            <Reply className="h-4 w-4" />
                            Send Reply
                          </Button>
                          <Button variant="outline" onClick={() => setIsReplying(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Notes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Admin Notes</CardTitle>
                  {!isEditingNotes && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditingNotes ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add internal notes about this message..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button size="sm" onClick={handleNotesSave}>
                        <Save className="h-4 w-4" />
                        Save Notes
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(false)}>
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-700">
                    {message.adminNotes ? (
                      <p className="whitespace-pre-wrap">{message.adminNotes}</p>
                    ) : (
                      <p className="text-gray-500 italic">No notes for this message</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">{message.name}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                  
                  {message.phone && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{message.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Message Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Message Created</p>
                      <p className="text-xs text-gray-500">{formatDate(message.createdAt)}</p>
                    </div>
                  </div>

                  {message.readAt && (
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Message Read</p>
                        <p className="text-xs text-gray-500">{formatDate(message.readAt)}</p>
                      </div>
                    </div>
                  )}

                  {message.repliedAt && (
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Reply Sent</p>
                        <p className="text-xs text-gray-500">{formatDate(message.repliedAt)}</p>
                      </div>
                    </div>
                  )}

                  {message.resolvedAt && (
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Message Resolved</p>
                        <p className="text-xs text-gray-500">{formatDate(message.resolvedAt)}</p>
                      </div>
                    </div>
                  )}

                  {message.updatedAt !== message.createdAt && (
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                        <p className="text-xs text-gray-500">{formatDate(message.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMessageView;