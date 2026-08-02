import { useCallback, useEffect, useState } from 'react';
import Navbar from './Navbar';
import SideBar from './SideBar';
import { Heart, MessageCircle, Send, Loader2 } from 'lucide-react';
import {
  ApiError,
  communityService,
  type CommunityPost,
} from '@/api';
import { useAuth } from '@/context/useAuth';
import { isSafeUrl, sanitizeText } from '@/lib/validation';

const MAX_POST_LENGTH = 2000;
const MAX_COMMENT_LENGTH = 500;

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newPost, setNewPost] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [posting, setPosting] = useState(false);

  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [busyPostId, setBusyPostId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Community | AGRISENSE';
  }, []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const description = sanitizeText(newPost).slice(0, MAX_POST_LENGTH);
    if (!description) return;

    const imageUrl = newImageUrl.trim();
    if (imageUrl && !isSafeUrl(imageUrl)) {
      setError('Please enter a valid http(s) image URL.');
      return;
    }

    setPosting(true);
    setError(null);
    try {
      const created = await communityService.createPost({
        description,
        imageUrl: imageUrl || undefined,
      });
      // The create response sometimes omits a populated author. Since we know
      // the current user authored it, fill it in so it never shows "Unknown".
      const withAuthor: CommunityPost = {
        ...created,
        author: created.author?.username
          ? created.author
          : user
            ? { id: user.id, username: user.username, email: user.email }
            : created.author,
        likes: created.likes ?? [],
        comments: created.comments ?? [],
        createdAt: created.createdAt ?? new Date().toISOString(),
      };
      setPosts((prev) => [withAuthor, ...prev]);
      setNewPost('');
      setNewImageUrl('');
      // Reload in the background to reconcile with the server's canonical data.
      loadPosts();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create post.');
    } finally {
      setPosting(false);
    }
  };

  const isLikedByMe = (post: CommunityPost) =>
    !!user && post.likes?.some((l) => l.user?.id === user.id);

  // Resolve a friendly author name even when the API omits the author object.
  const authorName = (post: CommunityPost) => {
    if (post.author?.username) return post.author.username;
    if (user && post.author?.id === user.id) return user.username;
    return 'Community member';
  };

  const handleLike = async (post: CommunityPost) => {
    setBusyPostId(post.id);
    try {
      await communityService.toggleLike(post.id);
      // Refresh just to keep like state accurate with the backend.
      await loadPosts();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to like post.');
    } finally {
      setBusyPostId(null);
    }
  };

  const handleComment = async (post: CommunityPost) => {
    const content = sanitizeText(commentDrafts[post.id] || '').slice(0, MAX_COMMENT_LENGTH);
    if (!content) return;
    setBusyPostId(post.id);
    try {
      await communityService.addComment(post.id, { content });
      setCommentDrafts((prev) => ({ ...prev, [post.id]: '' }));
      await loadPosts();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add comment.');
    } finally {
      setBusyPostId(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <main className="flex-1 flex flex-col overflow-auto bg-white">
        <Navbar />

        <div className="p-6 max-w-3xl w-full mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-[#0B6E4F]">Community</h1>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}

          {/* Create post */}
          <form
            onSubmit={handleCreatePost}
            className="bg-white border rounded-lg shadow-sm p-4 space-y-3"
          >
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with the community…"
              rows={3}
              maxLength={MAX_POST_LENGTH}
              className="w-full border rounded-md p-3 text-sm outline-none focus:border-[#2C6E49] resize-none"
            />
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Optional image URL"
              className="w-full border rounded-md p-2 text-sm outline-none focus:border-[#2C6E49]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={posting || !newPost.trim()}
                className="bg-[#2C6E49] hover:bg-[#23583a] text-white font-semibold text-sm px-5 py-2 rounded-md transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Post
              </button>
            </div>
          </form>

          {/* Feed */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#2C6E49]" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No posts yet. Be the first to post!</p>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <article key={post.id} className="bg-white border rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-[#2C6E49] flex items-center justify-center font-bold uppercase">
                      {authorName(post).charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{authorName(post)}</p>
                      <p className="text-xs text-gray-400">
                        {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 whitespace-pre-wrap mb-3">{post.description}</p>

                  {post.imageUrl && isSafeUrl(post.imageUrl) && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="rounded-md max-h-80 w-full object-cover mb-3"
                    />
                  )}

                  <div className="flex items-center gap-6 border-t pt-3 text-sm text-gray-600">
                    <button
                      onClick={() => handleLike(post)}
                      disabled={busyPostId === post.id}
                      className="flex items-center gap-1.5 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Heart
                        className={`h-4 w-4 ${isLikedByMe(post) ? 'fill-red-500 text-red-500' : ''}`}
                      />
                      {post.likes?.length || 0}
                    </button>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments?.length || 0}
                    </span>
                  </div>

                  {/* Comments */}
                  {post.comments?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {post.comments.map((c) => (
                        <div key={c.id} className="bg-gray-50 rounded-md px-3 py-2">
                          <p className="text-xs font-semibold text-gray-700">
                            {c.author?.username ||
                              (user && c.author?.id === user.id ? user.username : 'Community member')}
                          </p>
                          <p className="text-sm text-gray-700">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment */}
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      value={commentDrafts[post.id] || ''}
                      onChange={(e) =>
                        setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleComment(post);
                        }
                      }}
                      placeholder="Write a comment…"
                      maxLength={MAX_COMMENT_LENGTH}
                      className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:border-[#2C6E49]"
                    />
                    <button
                      onClick={() => handleComment(post)}
                      disabled={busyPostId === post.id || !(commentDrafts[post.id] || '').trim()}
                      className="text-[#2C6E49] hover:text-[#23583a] disabled:opacity-40"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Community;
