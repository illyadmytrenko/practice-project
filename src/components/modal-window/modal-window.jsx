export default function ModalWindow({ title, onClose, children, className }) {
  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] h-[70%] z-50 overflow-auto !p-8 !pb-5 flex flex-col gap-10 
      bg-black bg-[radial-gradient(ellipse_at_bottom_left,_rgba(34,197,94,0.3),_transparent_70%),radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.3),_transparent_70%)] 
      bg-no-repeat bg-scroll bg-blend-normal rounded-md !border-2 border-black ${className}`}
    >
      <div className="flex justify-between gap-10 items-center">
        <h2 className="text-4xl font-bold text-white">{title}</h2>
        <button type="button" onClick={onClose}>
          <img
            src="./assets/icons/close.png"
            alt="close icon"
            className="w-8 h-8"
          />
        </button>
      </div>
      {children}
    </div>
  );
}
