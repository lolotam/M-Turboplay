import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminNavHeader from '@/components/admin/AdminNavHeader';
import { exportUsersToCSV } from '@/lib/csvExport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  User,
  Download
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  provider?: 'google' | 'email' | 'supabase';
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

const AdminUserManagement: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      // Load users from localStorage (in production, this would be from your backend)
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      
      // Add default admin user
      const defaultAdmin: User = {
        id: 'admin-1',
        name: 'Store Administrator',
        email: 'mwaleedtam2016@gmail.com',
        role: 'admin',
        provider: 'email',
        createdAt: '2025-01-01T00:00:00.000Z',
        lastLogin: new Date().toISOString(),
        status: 'active',
      };

      // Convert registered users to User format
      const formattedUsers: User[] = registeredUsers.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        provider: user.provider || 'email',
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        status: 'active',
      }));

      const allUsers = [defaultAdmin, ...formattedUsers];
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);

      // Update localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const updatedRegisteredUsers = registeredUsers.map((user: any) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      localStorage.setItem('registered_users', JSON.stringify(updatedRegisteredUsers));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA-u-ca-gregory' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getProviderIcon = (provider?: string) => {
    switch (provider) {
      case 'google':
        return '🔍';
      case 'supabase':
        return '⚡';
      default:
        return '📧';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isRTL ? 'إدارة المستخدمين' : 'User Management'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isRTL
                ? 'إدارة حسابات المستخدمين والصلاحيات'
                : 'Manage user accounts and permissions'
              }
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => exportUsersToCSV(filteredUsers, isRTL)}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isRTL ? 'تصدير CSV' : 'Export CSV'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {isRTL ? 'إجمالي المستخدمين' : 'Total Users'}
                  </p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {isRTL ? 'المديرين' : 'Admins'}
                  </p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {isRTL ? 'المستخدمين العاديين' : 'Regular Users'}
                  </p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'user').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {isRTL ? 'المستخدمين النشطين' : 'Active Users'}
                  </p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {isRTL ? 'البحث والتصفية' : 'Search & Filter'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={isRTL ? 'البحث بالاسم أو البريد الإلكتروني...' : 'Search by name or email...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'user')}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">{isRTL ? 'جميع الأدوار' : 'All Roles'}</option>
                  <option value="admin">{isRTL ? 'المديرين' : 'Admins'}</option>
                  <option value="user">{isRTL ? 'المستخدمين' : 'Users'}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'قائمة المستخدمين' : 'Users List'}</CardTitle>
            <CardDescription>
              {isRTL 
                ? `عرض ${filteredUsers.length} من أصل ${users.length} مستخدم`
                : `Showing ${filteredUsers.length} of ${users.length} users`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                {isRTL ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : filteredUsers.length === 0 ? (
              <Alert>
                <AlertDescription>
                  {isRTL ? 'لا توجد مستخدمين مطابقين للبحث' : 'No users found matching your search'}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isRTL ? 'المستخدم' : 'User'}</TableHead>
                      <TableHead>{isRTL ? 'الدور' : 'Role'}</TableHead>
                      <TableHead>{isRTL ? 'المزود' : 'Provider'}</TableHead>
                      <TableHead>{isRTL ? 'تاريخ التسجيل' : 'Joined'}</TableHead>
                      <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? (isRTL ? 'مدير' : 'Admin') : (isRTL ? 'مستخدم' : 'User')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            {getProviderIcon(user.provider)}
                            {user.provider || 'email'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status === 'active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.id !== 'admin-1' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRoleChange(
                                    user.id, 
                                    user.role === 'admin' ? 'user' : 'admin'
                                  )}
                                >
                                  {user.role === 'admin' 
                                    ? (isRTL ? 'إزالة الإدارة' : 'Remove Admin')
                                    : (isRTL ? 'جعل مدير' : 'Make Admin')
                                  }
                                </Button>
                                <Button
                                  size="sm"
                                  variant={user.status === 'active' ? 'destructive' : 'default'}
                                  onClick={() => handleStatusChange(
                                    user.id,
                                    user.status === 'active' ? 'inactive' : 'active'
                                  )}
                                >
                                  {user.status === 'active' 
                                    ? (isRTL ? 'تعطيل' : 'Deactivate')
                                    : (isRTL ? 'تفعيل' : 'Activate')
                                  }
                                </Button>
                              </>
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
      </div>
    </div>
  );
};

export default AdminUserManagement;
