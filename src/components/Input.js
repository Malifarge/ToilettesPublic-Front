const Input = ({name,type,handleChange,texte,value,min,max}) =>{
    return(
        <div>
        <label htmlFor={name}>{texte}</label>
          <input type={type} name={name} onChange={handleChange} value={value} min={min} max={max}/>
        </div>
    )
}

export default Input