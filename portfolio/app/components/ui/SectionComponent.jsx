export default function SectionComponent() {
  return (
    <div className="flex flex-row justify-center bg-black px-[200px] pt-[40px] text-white">
      <div className="flex w-[600px] flex-col">
        <p className="text-[50px] font-bold">Why KFintech?</p>
        <p className="text-[30px] font-bold text-cyan-400">
          Secure Hyperscale Platform
        </p>
        <p className="text-[20px]">
          KFintech’s asset management platforms are the leading investor and
          Issuer servicing platforms. Our platforms are highly resilient, secure
          and scalable even as they are built on mobile-first micro services
          architecture driven and cloud-ready frameworks. KFintech has country
          specific platforms for asset classes of Mutual Funds, ETFs,
          Alternatives and Pensions for investor servicing & equities and bonds
          for issuer servicing. KFintech platforms and data are hosted in Tier
          IV data centers.
        </p>
      </div>
      <img
        align="left"
        height="500"
        width="500"
        src="https://www.kfintech.com/new-assets/images/logo-shape.svg"
        alt="KFintech shape"
      />
    </div>
  );
}
