// sections/ServiceSectionRenderer.js

export default function ServiceSectionRenderer({
  title,
  content,
  plain,
}) {
  if (!content) return null;

  return (
    <>
      {title && (
        // <h2 className="text-3xl font-bold mb-6 relative inline-block">
        //   {title}
        //   <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0" />
        // </h2>
          <h2 className="inline-block text-3xl font-bold text-black dark:text-white relative">
              Overview
              <span className="block mx-auto mt-2 h-[4px] w-3/5  bg-gradient-to-r from-transparent via-pink-600 to-transparent dark:via-white"></span>
          </h2>

      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mb-12 text-justify">
        <p>{content}</p>
      </div>
    </>
  );
}
