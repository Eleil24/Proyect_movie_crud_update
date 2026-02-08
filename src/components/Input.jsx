const Input = ({ name, label, type, handleInput, value }) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>
      <input
        className="input input-bordered input-primary w-full"
        type={type}
        name={name}
        onChange={handleInput}
        value={value[name]}
      />
    </div>
  )
}

export default Input
