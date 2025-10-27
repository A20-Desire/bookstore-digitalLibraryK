
function Card(props) {
  return (
   <div className="mt-10 my-5 p-5">
    <div className="card w-95 bg-base-100 shadow-xl hover:scale-105 duration-200  dark:bg-slate-900 dark:text-white">
  <figure>
    <img className="w-70 h-60"

      src={props.imageLink} alt=""/>
  </figure>
  <div className="card-body">
    <h2 className="card-title">
      {props.title}
      <div className="badge badge-secondary">{props.category}</div>
    </h2>

    <h3 className="font-semibold text-xl pd2">Author : <span className="font-normal text-xl pd2">{props.author}</span></h3>
    <p>{props.description}</p>

    <div className="card-actions justify-between">
    <div className="badge badge-outline mt-3 ml-3 ">{props.price} $</div>
      <div className=" bg-gray-200 px-2 py-2 rounded-md  hover:bg-pink-500 duration-200  dark:bg-slate-100 dark:text-black hover:text-white cursor-pointer">Read</div>
    </div>
  </div>
  </div>
</div>
  )
}

export default Card;
