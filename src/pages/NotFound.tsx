import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div style={{
      textAlign: isRTL ? 'right' : 'left',
      padding: '50px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '20px' }}>
        404 - {isRTL ? 'الصفحة غير موجودة' : 'Page Not Found'}
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#6c757d', marginBottom: '30px', maxWidth: '600px' }}>
        {isRTL
          ? 'عذراً، الصفحة التي تبحث عنها غير موجودة. قد تكون قد تم نقلها أو حذفها أو أدخلت عنوان URL خاطئ.'
          : 'Oops! The page you\'re looking for doesn\'t exist. It might have been moved, deleted, or you entered the wrong URL.'}
      </p>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <Link
          to="/"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        >
          {isRTL ? 'العودة إلى الرئيسية' : 'Return to Home'}
        </Link>
        <Link
          to="/admin"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '1rem'
          }}
        >
          {isRTL ? 'لوحة الإدارة' : 'Admin Dashboard'}
        </Link>
      </div>
      <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#adb5bd' }}>
        {isRTL ? 'إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بالدعم.' : 'If you think this is an error, please contact support.'}
      </p>
    </div>
  );
};

export default NotFound;
