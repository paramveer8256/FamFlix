const SearchSkeleton = () => {
  return (
    <div className="lg:px-15 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 gap-4">
      {Array.from({ length: 10 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse bg-gray-800 rounded-lg p-2"
        >
          <div className="w-full h-52 md:h-96 bg-gray-700 rounded" />
          <div className="mt-3 h-4 bg-gray-600 rounded w-3/4 mx-auto" />
          <div className="mt-2 h-4 bg-gray-600 rounded w-1/2 mx-auto" />
        </div>
      ))}
    </div>
  );
};

export default SearchSkeleton;
