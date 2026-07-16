import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { cmsService } from '@/lib/api';

export type Page = {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published' | 'archived';
  template?: string;
  layout?: string;
  seoKeywords?: string[];
  authorId: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  gallery?: string[];
  authorId: string;
  authorName: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishAt?: string;
  seoTitle?: string;
  metaDescription?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Banner = {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl: string;
  target: '_self' | '_blank';
  position: 'header' | 'footer' | 'sidebar' | 'popup' | 'custom';
  width: number;
  height: number;
  priority: number;
  startDate: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  clickThroughRate: number;
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  createdAt: string;
  updatedAt: string;
};

export type SiteSettings = {
  id: string;
  siteName: string;
  siteDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    whatsapp?: string;
  };
  currency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  weightUnit: string;
  lengthUnit: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  seoSettings: {
    titleSuffix: string;
    metaDescriptionTemplate: string;
    ogImageUrl?: string;
    twitterCardType?: string;
  };
  emailSettings: {
    provider: string;
    fromEmail: string;
    fromName: string;
    replyTo: string;
  };
  smsSettings: {
    provider: string;
    senderId: string;
  };
  pushSettings: {
    provider: string;
    vapidPublicKey?: string;
  };
  updatedAt: string;
  updatedBy: string;
};

export type CMSState = {
  pages: Page[];
  blogPosts: BlogPost[];
  faqs: FAQ[];
  banners: Banner[];
  siteSettings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  setPages: (pages: Page[]) => void;
  setBlogPosts: (posts: BlogPost[]) => void;
  setFAQs: (faqs: FAQ[]) => void;
  setBanners: (banners: Banner[]) => void;
  setSiteSettings: (settings: SiteSettings) => void;
  addPage: (page: Page) => void;
  updatePage: (id: string, page: Partial<Page>) => void;
  removePage: (id: string) => void;
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  removeBlogPost: (id: string) => void;
  addFAQ: (faq: FAQ) => void;
  updateFAQ: (id: string, faq: Partial<FAQ>) => void;
  removeFAQ: (id: string) => void;
  addBanner: (banner: Banner) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  removeBanner: (id: string) => void;
  fetchPages: () => Promise<void>;
  fetchPage: (id: string) => Promise<Page | null>;
  createPage: (data: any) => Promise<void>;
  updatePageAPI: (id: string, data: any) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  fetchBlogPosts: (filters?: any) => Promise<void>;
  fetchBlogPost: (id: string) => Promise<BlogPost | null>;
  createBlogPost: (data: any) => Promise<void>;
  updateBlogPostAPI: (id: string, data: any) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  fetchFAQs: () => Promise<void>;
  createFAQ: (data: any) => Promise<void>;
  updateFAQAPI: (id: string, data: any) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  fetchBanners: () => Promise<void>;
  createBanner: (data: any) => Promise<void>;
  updateBannerAPI: (id: string, data: any) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  getSiteSettings: () => Promise<void>;
  updateSiteSettings: (data: any) => Promise<void>;
  reset: () => void;
};

export const useCMSStore = create<CMSState>()(
  devtools(
    (set, get) => ({
      pages: [],
      blogPosts: [],
      faqs: [],
      banners: [],
      siteSettings: null,
      loading: false,
      error: null,
      setPages: (pages) => set({ pages }),
      setBlogPosts: (posts) => set({ blogPosts: posts }),
      setFAQs: (faqs) => set({ faqs }),
      setBanners: (banners) => set({ banners }),
      setSiteSettings: (settings) => set({ siteSettings: settings }),
      addPage: (page) => set((state) => ({ pages: [...state.pages, page] })),
      updatePage: (id, page) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === id ? { ...p, ...page } : p
          ),
        })),
      removePage: (id) =>
        set((state) => ({
          pages: state.pages.filter((p) => p.id !== id),
        })),
      addBlogPost: (post) =>
        set((state) => ({ blogPosts: [...state.blogPosts, post] })),
      updateBlogPost: (id, post) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((p) =>
            p.id === id ? { ...p, ...post } : p
          ),
        })),
      removeBlogPost: (id) =>
        set((state) => ({
          blogPosts: state.blogPosts.filter((p) => p.id !== id),
        })),
      addFAQ: (faq) => set((state) => ({ faqs: [...state.faqs, faq] })),
      updateFAQ: (id, faq) =>
        set((state) => ({
          faqs: state.faqs.map((f) =>
            f.id === id ? { ...f, ...faq } : f
          ),
        })),
      removeFAQ: (id) =>
        set((state) => ({
          faqs: state.faqs.filter((f) => f.id !== id),
        })),
      addBanner: (banner) =>
        set((state) => ({ banners: [...state.banners, banner] })),
      updateBanner: (id, banner) =>
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id ? { ...b, ...banner } : b
          ),
        })),
      removeBanner: (id) =>
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        })),
      fetchPages: async () => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.getPages();
          set({ pages: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchPage: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.getPage(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      createPage: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.createPage(data);
          get().addPage(response.data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updatePageAPI: async (id, data) => {
        set({ loading: true, error: null });
        try {
          await cmsService.updatePage(id, data);
          get().updatePage(id, data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      deletePage: async (id) => {
        set({ loading: true, error: null });
        try {
          await cmsService.deletePage(id);
          get().removePage(id);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchBlogPosts: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.getBlogs(filters);
          set({ blogPosts: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchBlogPost: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.getBlog(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      createBlogPost: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.createBlog(data);
          get().addBlogPost(response.data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateBlogPostAPI: async (id, data) => {
        set({ loading: true, error: null });
        try {
          await cmsService.updateBlog(id, data);
          get().updateBlogPost(id, data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      deleteBlogPost: async (id) => {
        set({ loading: true, error: null });
        try {
          await cmsService.deleteBlog(id);
          get().removeBlogPost(id);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchFAQs: async () => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.getFaqs();
          set({ faqs: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      createFAQ: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.createFaq(data);
          get().addFAQ(response.data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateFAQAPI: async (id, data) => {
        set({ loading: true, error: null });
        try {
          await cmsService.updateFaq(id, data);
          get().updateFAQ(id, data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      deleteFAQ: async (id) => {
        set({ loading: true, error: null });
        try {
          await cmsService.deleteFaq(id);
          get().removeFAQ(id);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchBanners: async () => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.getBanners();
          set({ banners: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      createBanner: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.createBanner(data);
          get().addBanner(response.data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateBannerAPI: async (id, data) => {
        set({ loading: true, error: null });
        try {
          await cmsService.updateBanner(id, data);
          get().updateBanner(id, data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      deleteBanner: async (id) => {
        set({ loading: true, error: null });
        try {
          await cmsService.deleteBanner(id);
          get().removeBanner(id);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getSiteSettings: async () => {
        set({ loading: true, error: null });
        try {
          const response = await cmsService.getSiteSettings();
          set({ siteSettings: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateSiteSettings: async (data) => {
        set({ loading: true, error: null });
        try {
          await cmsService.updateSiteSettings(data);
          get().setSiteSettings(data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      reset: () => {
        set({
          pages: [],
          blogPosts: [],
          faqs: [],
          banners: [],
          siteSettings: null,
          loading: false,
          error: null,
        });
      },
    }),
    { name: 'CMSStore' }
  )
);