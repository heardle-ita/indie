import { versions } from "../utils/constants";


function AllVersions() {

  return (
    <>
      <p className="text-sm text-center uppercase text-custom-line font-semibold tracking-widest pb-6">Se ti piace Heardle Italia, adorerai :</p>
      {versions.map((v,i) => {
        return (
        <div className="text-center pb-4" key={i}>
          <div className="versions bg-indigo-800 items-center text-indigo-100 leading-none rounded-full flex inline-flex" role="alert">
            <span className = {"mr-2 px-2 py-1 rounded-full uppercase text-xs font-bold " + 
            (
              v.class != undefined ? 
              v.class :
              "my-2")
            } id={v.class}>{v.tag}</span>
            <span className="font-semibold mr-2 text-left flex-auto" id="name"><a href={v.url}>Heardle Italia {v.name}!</a></span>
            <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
          </div>
        </div>
        )
      })}
    </>
  );
}

export default AllVersions;