export default function ImagePicker({ label, images, register, error }) {
    return (
        <>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <ul className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {images.map((pic, index) => (
                    <li key={pic} className="flex flex-col col-span-1">
                        <input
                            type="radio"
                            name="coverPhoto"
                            value={pic}
                            id={pic}
                            ref={register({ required: 'Please select an image.' })}
                            className="hidden"
                        />
                        <label htmlFor={pic} className="relative flex flex-col flex-1 cursor-pointer">
                            <img
                                className="flex-shrink-0 bg-black rounded-lg shadow"
                                src={pic}
                                alt={`Cover photo ${index}`}
                                aria-hidden="true"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="absolute invisible w-10 h-10 text-green-500 bg-white rounded-full after-checked:visible -top-2 -right-2"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </label>
                    </li>
                ))}
            </ul>
            {error ? <p className="mt-2 text-sm text-red-600">{error.message}</p> : null}
        </>
    );
}
