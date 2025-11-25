import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Play, ExternalLink, BookOpen, Video } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CommunityContent = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const blogPosts = [
    {
      id: 1,
      title: isRTL ? 'أفضل 10 ألعاب PS5 في 2025' : 'Top 10 PS5 Games in 2025',
      excerpt: isRTL ? 'دليل شامل لأفضل الألعاب المتوفرة على PlayStation 5 هذا العام' : 'Comprehensive guide to the best PlayStation 5 games available this year',
      author: isRTL ? 'فريق M-TurboPlay' : 'M-TurboPlay Team',
      date: '2025-01-15',
      readTime: '5 min read',
      image: '/placeholder.svg',
      category: isRTL ? 'مراجعات الألعاب' : 'Game Reviews'
    },
    {
      id: 2,
      title: isRTL ? 'كيفية اختيار أفضل إكسسوارات الألعاب' : 'How to Choose the Best Gaming Accessories',
      excerpt: isRTL ? 'نصائح مهمة لاختيار الإكسسوارات المناسبة لتجربة لعب مثالية' : 'Important tips for choosing the right accessories for the perfect gaming experience',
      author: isRTL ? 'أحمد المحمد' : 'Ahmed Al-Mohammed',
      date: '2025-01-12',
      readTime: '7 min read',
      image: '/placeholder.svg',
      category: isRTL ? 'أدلة الشراء' : 'Buying Guides'
    },
    {
      id: 3,
      title: isRTL ? 'مقارنة شاملة: PS5 vs Xbox Series X' : 'Comprehensive Comparison: PS5 vs Xbox Series X',
      excerpt: isRTL ? 'مقارنة تفصيلية بين أحدث كونسولات الألعاب في السوق' : 'Detailed comparison between the latest gaming consoles on the market',
      author: isRTL ? 'سارة العتيبي' : 'Sarah Al-Otaibi',
      date: '2025-01-10',
      readTime: '10 min read',
      image: '/placeholder.svg',
      category: isRTL ? 'مقارنات' : 'Comparisons'
    }
  ];

  const videos = [
    {
      id: 1,
      title: isRTL ? 'مراجعة لعبة Spider-Man 2' : 'Spider-Man 2 Game Review',
      thumbnail: '/placeholder.svg',
      duration: '12:45',
      views: '15.2K',
      uploadDate: '2025-01-08'
    },
    {
      id: 2,
      title: isRTL ? 'أفضل إعدادات الألعاب للمبتدئين' : 'Best Gaming Settings for Beginners',
      thumbnail: '/placeholder.svg',
      duration: '8:32',
      views: '8.7K',
      uploadDate: '2025-01-05'
    },
    {
      id: 3,
      title: isRTL ? 'جولة في متجر M-TurboPlay الجديد' : 'Tour of the New M-TurboPlay Store',
      thumbnail: '/placeholder.svg',
      duration: '5:18',
      views: '12.1K',
      uploadDate: '2025-01-03'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30 px-4 py-2 mb-6">
            📱 {isRTL ? 'مجتمع ومحتوى' : 'Community & Content'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-baloo" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
            {isRTL ? (
              <>
                <span className="block text-white mb-2">
                  انضم إلى مجتمع
                </span>
                <span className="text-gradient">
                  اللاعبين العرب
                </span>
              </>
            ) : (
              <>
                <span className="block text-white mb-2">
                  Join the Arab
                </span>
                <span className="text-gradient">
                  Gaming Community
                </span>
              </>
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {isRTL ? (
              'تابع أحدث الأخبار، المراجعات، والنصائح في عالم الألعاب العربي'
            ) : (
              'Follow the latest news, reviews, and tips in the Arab gaming world'
            )}
          </p>
        </div>

        {/* Blog Posts Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#A855F7]" />
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {isRTL ? 'أحدث المقالات' : 'Latest Articles'}
              </h3>
            </div>
            <Button
              variant="outline"
              className="border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white"
              onClick={() => navigate('/blog')}
            >
              {isRTL ? 'عرض جميع المقالات' : 'View All Articles'}
              <ExternalLink className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-[#1A1A2E] border-[#A855F7]/20 hover:border-[#A855F7]/50 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <CardContent className="p-0">
                  {/* Post Image */}
                  <div className="aspect-video bg-gradient-to-br from-[#6B46C1]/20 to-[#A855F7]/20 rounded-t-lg flex items-center justify-center">
                    <div className="text-center text-[#C4B5FD]">
                      <BookOpen className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">{post.category}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <Badge className="bg-[#A855F7]/20 text-[#A855F7] mb-3">
                      {post.category}
                    </Badge>

                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#A855F7] transition-colors line-clamp-2">
                      {post.title}
                    </h4>

                    <p className="text-[#C4B5FD] text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-[#9CA3AF]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Videos Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-[#E935C1]" />
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {isRTL ? 'أحدث الفيديوهات' : 'Latest Videos'}
              </h3>
            </div>
            <Button
              variant="outline"
              className="border-[#E935C1] text-[#E935C1] hover:bg-[#E935C1] hover:text-white"
              onClick={() => navigate('/videos')}
            >
              {isRTL ? 'عرض جميع الفيديوهات' : 'View All Videos'}
              <Play className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="bg-[#1A1A2E] border-[#A855F7]/20 hover:border-[#A855F7]/50 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/video/${video.id}`)}
              >
                <CardContent className="p-0">
                  {/* Video Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-[#E935C1]/20 to-[#A855F7]/20 rounded-t-lg flex items-center justify-center relative group">
                    <div className="text-center text-[#C4B5FD]">
                      <Play className="w-16 h-16 mx-auto mb-2" />
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#E935C1] rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#E935C1] transition-colors line-clamp-2">
                      {video.title}
                    </h4>

                    <div className="flex items-center justify-between text-sm text-[#9CA3AF]">
                      <span>{video.views} {isRTL ? 'مشاهدة' : 'views'}</span>
                      <span>{formatDate(video.uploadDate)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#A855F7]/10 to-[#E935C1]/10 rounded-2xl p-8 border border-[#A855F7]/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              {isRTL ? 'انضم إلى مجتمعنا' : 'Join Our Community'}
            </h3>
            <p className="text-[#C4B5FD] mb-6 max-w-2xl mx-auto">
              {isRTL ? (
                'تابعنا على وسائل التواصل الاجتماعي واحصل على أحدث الأخبار والعروض الحصرية'
              ) : (
                'Follow us on social media and get the latest news and exclusive offers'
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Instagram', 'Twitter', 'TikTok', 'YouTube', 'Discord'].map((platform) => (
                <Button
                  key={platform}
                  variant="outline"
                  className="border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white"
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityContent;