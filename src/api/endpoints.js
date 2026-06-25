/**
 * Central registry of API endpoint paths (relative to VITE_API_URL).
 *
 * These follow standard Laravel + Sanctum conventions. If your routes/api.php
 * uses different paths (e.g. /signalements instead of /items), change them
 * HERE — nothing else in the app hardcodes a URL.
 */
export const ENDPOINTS = {
  // Auth (Sanctum token)
  register: '/register',
  login: '/login',
  logout: '/logout',
  me: '/me', // AuthController@me — returns the authenticated user
  profile: '/profile', // GET + POST (update)

  // Reports / "signalements"
  items: '/items',
  item: (id) => `/items/${id}`,
  postMatches: (id) => `/posts/${id}/matches`, // Feature 9

  // Reports feed + single report (home feed & details page)
  posts: '/posts',
  post: (id) => `/posts/${id}`,
  categories: '/categories',

  // Comments on a report
  comments: '/comments',
  comment: (id) => `/comments/${id}`,

  // Reporting a post (Priority 3)
  reports: '/reports',
  // Reporting a comment / a message (Tasks 4 & 6)
  commentReport: (id) => `/comments/${id}/report`,
  messageReport: (id) => `/messages/${id}/report`,

  // Favorites (Priority 6)
  favorites: '/favorites',
  favorite: (postId) => `/favorites/${postId}`,

  // Admin / moderation (Priority 7)
  adminStats: '/admin/stats',
  adminReports: '/admin/reports',
  adminPosts: '/admin/posts',
  adminPostHide: (id) => `/admin/posts/${id}/hide`,
  adminPost: (id) => `/admin/posts/${id}`,
  adminComments: '/admin/comments',
  adminComment: (id) => `/admin/comments/${id}`,
  adminUsers: '/admin/users',
  adminUserStatus: (id) => `/admin/users/${id}/status`,
  adminLogs: '/admin/logs',
  adminMessages: '/admin/messages', // Feature 4
  adminMatches: '/admin/matches', // Feature 9
  adminMessage: (id) => `/admin/messages/${id}`, // delete a reported message
  // Moderation (Tasks 4 & 6)
  adminCommentReports: '/admin/comment-reports',
  adminCommentReportIgnore: (id) => `/admin/comment-reports/${id}/ignore`,
  adminMessageReports: '/admin/message-reports',
  adminMessageReportIgnore: (id) => `/admin/message-reports/${id}/ignore`,

  // Admin user management
  users: '/users',

  // Messaging
  conversations: '/conversations',
  messages: (conversationId) => `/conversations/${conversationId}/messages`,
  conversationRead: (userId) => `/conversations/${userId}/read`,
  unreadCount: '/messages/unread-count',

  // Notifications / alerts
  notifications: '/notifications',
  notificationRead: (id) => `/notifications/${id}/read`,
  notificationsReadAll: '/notifications/read-all',
}
