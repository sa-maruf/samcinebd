// src/components/ScrollToTopWrapper.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// এটি একটি 'উচ্চ-স্তরের' কম্পোনেন্ট (HOC) যা চিলড্রেনগুলিকে রেন্ডার করে
// এবং রুটের পরিবর্তনগুলি লক্ষ্য করে উইন্ডো স্ক্রোল করে।
export default function ScrollToTopWrapper(props) {
  const { pathname } = useLocation();

  useEffect(() => {
    // প্রতিবার রুটের pathname পরিবর্তন হলে এটি চলবে।
    // উইন্ডোকে একদম উপরে এবং বামে স্ক্রোল করুন (0, 0)।
    window.scrollTo(0, 0);
  }, [pathname]); // 'pathname' পরিবর্তন হলে এই এফেক্টটি পুনরায় চলবে।

  // চিলড্রেন কম্পোনেন্ট রেন্ডার করুন।
  return props.children;
}