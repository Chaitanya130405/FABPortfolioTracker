export default function SiteHeader() {
  return (
    <div className="flex flex-row items-center justify-between bg-black px-[200px] text-white">
      <img
        width="270"
        src="https://imgs.search.brave.com/eKSBdEx4h-mpwXF4rSu9V8eNZnhhGyd0OMDZ55lBcho/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9ldm90/aW5nLmtmaW50ZWNo/LmNvbS9pbWFnZXMv/a2ZpbnRlY2hfbG9n/by5zdmc"
        alt="KFintech"
      />
      <div className="flex flex-row space-x-4">
        <p>Solutions</p>
        <p>Products</p>
        <p>About us</p>
        <p>Portfolio Companies</p>
      </div>
      <div className="flex flex-row space-x-4">
        <p>Career</p>
        <p>Blog</p>
        <p>Contact us</p>
        <p>Newsletters</p>
      </div>
    </div>
  );
}
