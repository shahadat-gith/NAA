const CenterTitle = ({ title }) => {
  return (
    <div className="flex-1 min-w-0 text-center">
      <h2 className="text-base font-black tracking-tight text-text-primary truncate px-2">
        {title}
      </h2>
    </div>
  );
};

export default CenterTitle;