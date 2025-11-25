import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMessages } from '@/contexts/MessagesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Search, Eye, Reply, Archive, Trash2, Mail, MailOpen, AlertTriangle, Clock, CheckCircle, FileText, Users, Star, TrendingUp, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminNavHeader from '@/components/admin/AdminNavHeader';
import { exportMessagesToCSV } from '@/lib/csvExport';

const AdminMessages: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { 
    messages, 
    isLoading, 
    searchMessages, 
    getMessageStats, 
    markAsRead, 
    markAsUnread, 
    updateMessageStatus, 
    archiveMessage, 
    deleteMessage 
  } = useMessages();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const stats = getMessageStats();
  const filteredMessages = searchMessages(searchQuery, statusFilter, categoryFilter, priorityFilter, dateFrom, dateTo);

  // Check if all visible messages are selected
  const areAllMessagesSelected = useMemo(() => {
    return filteredMessages.length > 0 && filteredMessages.every(msg => selectedMessages.includes(msg.id));
  }, [filteredMessages, selectedMessages]);

  // Check if some but not all messages are selected
  const areSomeMessagesSelected = useMemo(() => {
    return selectedMessages.length > 0 && !areAllMessagesSelected;
  }, [selectedMessages, areAllMessagesSelected]);

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
      case 'business': return <Users className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const isArabic = i18n.language === 'ar';

    if (isArabic) {
      return date.toLocaleString('ar-KW-u-ca-gregory', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleQuickAction = async (messageId: string, action: string) => {
    try {
      switch (action) {
        case 'markRead':
          await markAsRead(messageId);
          break;
        case 'markUnread':
          await markAsUnread(messageId);
          break;
        case 'resolve':
          await updateMessageStatus(messageId, 'resolved');
          break;
        case 'archive':
          await archiveMessage(messageId);
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this message?')) {
            await deleteMessage(messageId);
          }
          break;
      }
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMessages(filteredMessages.map(msg => msg.id));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleSelectMessage = (messageId: string, checked: boolean) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, messageId]);
    } else {
      setSelectedMessages(selectedMessages.filter(id => id !== messageId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) return;

    const confirmMessage = isRTL
      ? `هل أنت متأكد من حذف ${selectedMessages.length} رسالة؟`
      : `Are you sure you want to delete ${selectedMessages.length} message(s)?`;

    if (confirm(confirmMessage)) {
      setIsDeleting(true);
      try {
        // Delete each selected message
        for (const messageId of selectedMessages) {
          await deleteMessage(messageId);
        }
        setSelectedMessages([]);
      } catch (error) {
        console.error('Error deleting messages:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleBulkMarkRead = async () => {
    if (selectedMessages.length === 0) return;
    try {
      for (const messageId of selectedMessages) {
        await markAsRead(messageId);
      }
      setSelectedMessages([]);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleBulkMarkUnread = async () => {
    if (selectedMessages.length === 0) return;
    try {
      for (const messageId of selectedMessages) {
        await markAsUnread(messageId);
      }
      setSelectedMessages([]);
    } catch (error) {
      console.error('Error marking messages as unread:', error);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Admin Navigation Header */}
      <AdminNavHeader />

      {/* Page Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
                <Mail className="w-6 h-6" />
                {isRTL ? 'إدارة الرسائل' : 'Messages Management'}
              </h1>
              <p className="text-muted-foreground font-medium">
                {isRTL ? 'إدارة رسائل واستفسارات العملاء' : 'Manage customer messages and inquiries'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedMessages.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    {isRTL ? `${selectedMessages.length} محدد` : `${selectedMessages.length} selected`}
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isRTL ? 'حذف المحدد' : 'Delete Selected'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkMarkRead}
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    {isRTL ? 'تعيين كمقروء' : 'Mark as Read'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkMarkUnread}
                    className="flex items-center gap-2"
                  >
                    <MailOpen className="w-4 h-4" />
                    {isRTL ? 'تعيين كغير مقروء' : 'Mark as Unread'}
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => exportMessagesToCSV(filteredMessages, isRTL)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isRTL ? 'تصدير CSV' : 'Export CSV'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
                </div>
                <MailOpen className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Read</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Replied</p>
                  <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
                </div>
                <Reply className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.urgent}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`} />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="order_inquiry">Order Inquiry</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="From Date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />

              <Input
                type="date"
                placeholder="To Date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Search className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {filteredMessages.length} messages found
                </span>
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <span>Messages List</span>
              <Badge variant="secondary">{filteredMessages.length} messages</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No messages found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">#</TableHead>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={areAllMessagesSelected}
                          indeterminate={areSomeMessagesSelected}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Message #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message, index) => (
                      <TableRow key={message.id} className={!message.isRead ? 'bg-primary/10 border-l-2 border-l-primary/30' : ''}>
                        <TableCell className="text-center font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedMessages.includes(message.id)}
                            onCheckedChange={(checked) => handleSelectMessage(message.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="font-medium">{message.messageNumber}</span>
                            {message.attachments && message.attachments.length > 0 && (
                              <FileText className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-bold text-foreground">{message.name}</div>
                            <div className="text-sm font-medium text-muted-foreground">{message.email}</div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="max-w-xs truncate font-medium" title={message.subject}>
                            {message.subject}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            {getCategoryIcon(message.category)}
                            <span className="capitalize">{message.category.replace('_', ' ')}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className={`${getPriorityColor(message.priority)} capitalize`}>
                            {message.priority}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <Badge className={`${getStatusColor(message.status)} capitalize`}>
                              {message.status}
                            </Badge>
                            {message.status === 'unread' && (
                              <div className="text-xs text-red-600">Payment Pending</div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{formatDate(message.createdAt).split(' ')[0]}</div>
                            <div className="text-xs text-gray-500">{formatDate(message.createdAt).split(' ')[1]} {formatDate(message.createdAt).split(' ')[2]}</div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Link to={`/admin/messages/view/${message.id}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {message.isRead ? (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleQuickAction(message.id, 'markUnread')}
                              >
                                <MailOpen className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleQuickAction(message.id, 'markRead')}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminMessages;