export function SectionDivider() {
  return (
    <div className="flex justify-center px-6">
      <div
        className="h-px w-full max-w-peec"
        style={{
          background:
            "linear-gradient(90deg, rgba(82,82,82,0.1) 0%, rgba(82,82,82,0.5) 50%, rgba(82,82,82,0.1) 100%)",
        }}
      />
    </div>
  );
}
