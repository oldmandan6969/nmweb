import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { gsap } from "gsap";

interface Reply { content: string; author: string; }
interface Thread { _id: string; title: string; content: string; author: string; replies: Reply[]; }

export const ThreadDetail = () => {
  const { id } = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const repliesRef = useRef<HTMLDivElement>(null);

  const fetchThread = async () => {
    const res = await fetch(`https://nmweb-back-end.onrender.com/threads/${id}`);
    const data = await res.json();
    setThread(data);
  };

  useEffect(() => { fetchThread(); }, [id]);

  const postReply = async () => {
    if (!replyContent || !thread) return;

    const res = await fetch(`https://nmweb-back-end.onrender.com/threads/${id}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent, author: "Anonymous" }),
    });

    if (res.ok) {
      const updatedThread = await res.json();
      setThread(updatedThread);
      setReplyContent("");

      setTimeout(() => {
        if (repliesRef.current && repliesRef.current.lastElementChild) {
          gsap.from(repliesRef.current.lastElementChild, { opacity: 0, y: 40, duration: 0.5, ease: "back.out(1.3)" });
        }
      }, 50);
    }
  };

  if (!thread) return <p className="text-street-dust text-center mt-12">Loading...</p>;

  return (
    <section className="section-padding relative bg-street-concrete overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-street-black to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-street-black" />
      <div className="container-street relative z-10">
        <h2 className="font-stencil text-4xl md:text-6xl text-street-white mb-6 text-shadow-brutal">
          {thread.title}
        </h2>
        <p className="font-body text-street-black mb-6">{thread.content}</p>

        {/* Reply Form */}
        <div className="mb-6 p-4 bg-street-asphalt shadow-brutal rounded">
          <textarea
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-3 mb-2 font-body border border-street-metal bg-street-black text-street-white"
          />
          <button onClick={postReply} className="btn-brutal bg-gang-blue text-street-black">
            Post Reply
          </button>
        </div>

        {/* Replies */}
        <div ref={repliesRef} className="space-y-4">
          {thread.replies.length === 0 && (
            <p className="text-street-dust font-stamp">No replies yet.</p>
          )}
          {thread.replies.map((r, i) => (
            <div key={i} className="p-4 bg-street-cream shadow-brutal rounded hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all duration-200">
              <p className="font-body text-street-black">{r.content}</p>
              <span className="text-xs text-street-dust mt-2 block">{r.author}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};