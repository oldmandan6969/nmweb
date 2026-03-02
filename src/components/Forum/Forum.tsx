import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

interface Thread {
  _id: string;
  title: string;
  content: string;
  author: string;
  replies: { content: string; author: string }[];
}

export const Forum = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const threadsRef = useRef<HTMLDivElement>(null);

  const fetchThreads = async () => {
    const res = await fetch("https://nmweb-back-end.onrender.com/threads");
    const data = await res.json();
    setThreads(data);
  };

  useEffect(() => { fetchThreads(); }, []);

  const postThread = async () => {
    if (!title || !content) return;
    const res = await fetch("https://nmweb-back-end.onrender.com/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, author: "Anonymous" }),
    });
    if (res.ok) {
      const newThread = await res.json();
      setThreads(prev => [newThread, ...prev]);
      setTitle(""); setContent("");

      setTimeout(() => {
        if (threadsRef.current && threadsRef.current.firstElementChild) {
          gsap.from(threadsRef.current.firstElementChild, {
            opacity: 0,
            y: 40,
            duration: 0.5,
            ease: "back.out(1.3)",
          });
        }
      }, 50);
    }
  };

  return (
    <section className="section-padding relative bg-street-concrete overflow-hidden">
      {/* Top and bottom gradients */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-street-black to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-street-black" />

      <div className="container-street relative z-10">
        {/* Page title */}
        <div className="text-center mb-12">
          <h2 className="font-stencil text-4xl md:text-6xl text-street-white uppercase text-shadow-brutal mb-4">
            Street <span className="text-gang-blue">Forum</span>
          </h2>
          <p className="text-street-dust font-body max-w-2xl mx-auto">
            Share your posts and discuss with the street community.
          </p>
          <div className="w-24 h-1 bg-gang-blue mx-auto mt-4" />
        </div>

        {/* Create Thread Form */}
        <div className="mb-8 p-6 bg-street-asphalt shadow-brutal rounded">
          <input
            type="text"
            placeholder="Thread Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full mb-2 p-3 font-stamp border border-street-metal bg-street-black text-street-white"
          />
          <textarea
            placeholder="Write your post..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full mb-2 p-3 font-body border border-street-metal bg-street-black text-street-white"
          />
          <button
            onClick={postThread}
            className="btn-brutal bg-gang-blue text-street-black"
          >
            Post Thread
          </button>
        </div>

        {/* Threads List */}
        <div ref={threadsRef} className="grid gap-6">
          {threads.length === 0 && (
            <p className="text-street-dust font-stamp text-center">No threads yet.</p>
          )}
          {threads.map(thread => (
            <Link key={thread._id} to={`/threads/${thread._id}`}>
              <div className="p-4 bg-street-cream shadow-brutal rounded cursor-pointer hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal-lg transition-all duration-200">
                <h3 className="font-stencil text-xl text-gang-blue">{thread.title}</h3>
                <p className="font-body text-street-black mt-2">{thread.content}</p>
                <span className="text-xs text-street-dust mt-2 block">{thread.author}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};