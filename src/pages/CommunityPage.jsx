// src/pages/CommunityPage.jsx
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/layout/PageHeader';
import toast from 'react-hot-toast';
import { Heart, MessageCircle, Plus, Send } from 'lucide-react';
import clsx from 'clsx';

const ROOMS = [
  { id: 'pcos',            emoji: '🎀', label: 'PCOS Support',     members: '2.4k' },
  { id: 'pregnancy',       emoji: '🤰', label: 'Pregnancy',        members: '5.1k' },
  { id: 'hormone_balance', emoji: '⚖️', label: 'Hormone Balance',  members: '1.8k' },
  { id: 'general',         emoji: '💜', label: 'General Health',   members: '8.2k' },
  { id: 'mental_health',   emoji: '🧘', label: 'Mental Health',    members: '3.1k' },
  { id: 'thyroid',         emoji: '🦋', label: 'Thyroid',          members: '1.2k' },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeRoom, setActiveRoom] = useState('general');
  const [posts, setPosts]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [newPost, setNewPost]       = useState({ title: '', content: '', anonymous: false });
  const [posting, setPosting]       = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [activeRoom]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/community/posts?room=${activeRoom}`);
      setPosts(data.posts || []);
    } catch {
      // Use mock data if API not available
      setPosts([
        { _id: '1', user: { name: 'PriyaHealthy' }, content: 'Has anyone tried metformin for PCOS? My doctor just prescribed it and I\'m a bit nervous 😅', reactions: { heart: 5, support: 3 }, commentCount: 8, createdAt: new Date().toISOString(), anonymous: false },
        { _id: '2', user: { name: 'Anonymous User' }, content: 'Best Indian foods for managing PCOS symptoms? I\'ve been trying ragi and methi combination!', reactions: { heart: 24, support: 12 }, commentCount: 45, createdAt: new Date(Date.now() - 7200000).toISOString(), anonymous: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const react = async (postId, reaction) => {
    try {
      await api.post(`/community/posts/${postId}/react`, { reaction });
      setPosts(prev => prev.map(p =>
        p._id === postId ? { ...p, reactions: { ...p.reactions, [reaction]: (p.reactions?.[reaction] || 0) + 1 } } : p
      ));
    } catch {}
  };

  const createPost = async () => {
    if (!newPost.content.trim()) return toast.error('Write something first!');
    setPosting(true);
    try {
      await api.post('/community/posts', { ...newPost, room: activeRoom });
      toast.success('Post shared! 🌸');
      setShowNew(false);
      setNewPost({ title: '', content: '', anonymous: false });
      fetchPosts();
    } catch {
      toast.error('Failed to post');
    } finally {
      setPosting(false);
    }
  };

  const room = ROOMS.find(r => r.id === activeRoom);

  return (
    <div className="fade-in-up">
      <PageHeader title="Community" subtitle="Anonymous & safe space" />

      {/* Room selector */}
      <div className="flex gap-2 px-5 mb-4 overflow-x-auto pb-1">
        {ROOMS.map(r => (
          <button key={r.id} onClick={() => setActiveRoom(r.id)}
            className={clsx('flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium border-2 transition-all',
              activeRoom === r.id
                ? 'border-rose bg-rose text-white'
                : 'border-gray-200 bg-white text-gray-600')}>
            {r.emoji} {r.label}
            <span className={clsx('text-[10px]', activeRoom === r.id ? 'text-white/70' : 'text-gray-400')}>
              {r.members}
            </span>
          </button>
        ))}
      </div>

      {/* Room header */}
      <div className="mx-5 mb-4 p-3 bg-rose-light rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{room?.emoji}</span>
          <div>
            <p className="text-sm font-semibold text-charcoal">{room?.label}</p>
            <p className="text-xs text-gray-400">{room?.members} members</p>
          </div>
        </div>
        <button onClick={() => setShowNew(s => !s)}
          className="flex items-center gap-1.5 bg-rose text-white px-3 py-1.5 rounded-xl text-xs font-medium">
          <Plus size={12} /> Post
        </button>
      </div>

      {/* New post form */}
      {showNew && (
        <div className="card mx-5 mb-4 fade-in-up">
          <h3 className="font-display font-semibold text-charcoal mb-3">Share with the community</h3>
          <input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
            className="input mb-2" placeholder="Title (optional)" />
          <textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
            className="input resize-none h-24 mb-3" placeholder="What's on your mind?" />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setNewPost(p => ({ ...p, anonymous: !p.anonymous }))}
                className={clsx('w-8 h-4 rounded-full transition-colors relative',
                  newPost.anonymous ? 'bg-rose' : 'bg-gray-200')}>
                <span className={clsx('absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform',
                  newPost.anonymous ? 'translate-x-4' : 'translate-x-0.5')} />
              </div>
              <span className="text-xs text-gray-400">Post anonymously</span>
            </label>
            <button onClick={createPost} disabled={posting}
              className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
              <Send size={14} />
              {posting ? 'Posting…' : 'Share'}
            </button>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="px-5 space-y-3 pb-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
              <div className="h-10 bg-gray-100 rounded mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-3xl mb-2">🌸</p>
            <p className="text-gray-400 text-sm">No posts yet. Be the first to share!</p>
          </div>
        ) : posts.map(post => (
          <div key={post._id} className="card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-lilac-light rounded-full flex items-center justify-center text-xs font-bold text-lilac-dark">
                {post.anonymous ? 'A' : post.user?.name?.[0] || 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal">
                  {post.anonymous ? 'Anonymous' : post.user?.name}
                </p>
                <p className="text-[10px] text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                </p>
              </div>
            </div>
            {post.title && <h4 className="font-semibold text-charcoal text-sm mb-1">{post.title}</h4>}
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4">
              <button onClick={() => react(post._id, 'heart')}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose transition-colors">
                <Heart size={14} />
                {post.reactions?.heart || 0}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-lilac transition-colors">
                <MessageCircle size={14} />
                {post.commentCount || 0} replies
              </button>
              <button onClick={() => react(post._id, 'support')}
                className="ml-auto text-xs text-gray-400 hover:text-sage transition-colors">
                🤗 {post.reactions?.support || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
