import { FormEvent } from "react";
import { FaSpinner } from "react-icons/fa";
import Logo from "../Logo";
import Link from "next/link";
import Input, { type InputProps } from "../Input";

interface props {
    submitHandler: (event: FormEvent<HTMLFormElement>) => void
    AlreadySigned: () => void;
    error?: string;
    isLoading: boolean;
}

const registerFields: InputProps[] = [
  {
    name: 'fullname',
    label: 'fullname',
    placeholder: 'fullname',
    type: 'text',
    required: true,
  },
  { 
    name: 'email',
    label: 'email',
    placeholder: 'example@gmail.com',
    type: 'email',
    required: true,
  },
  { 
    name: 'password',
    label: 'password',
    placeholder: 'enter your password',
    type: 'password',
    required: true,
  },
  { 
    name: 're_password',
    label: 'password',
    placeholder: 'confirm your password',
    type: 'password',
    required: true,
  }
]
const RegisterForm: React.FC<props> = ({submitHandler, AlreadySigned, error, isLoading}) => {
    return (
      <form
      onSubmit={submitHandler}
      className="min-h-[75vh] w-[80%] md:w-1/2 xl:w-[40%] bg-transparent flex flex-col justify-center items-center rounded-lg border-gray-500/20 p-3 sm:border sm:shadow-2xl sm:backdrop-blur-lg px-[50px]"
    >
    
     
      <div className="flex flex-col items-center gap-1">
        <Link href="/" className="pb-5">
          <Logo />
        </Link>
        <h3 className="font-bold text-xl" >Connectez-vous</h3>
        <p>Entrez vos identifiants pour acceder a votre compte</p>
      </div>
      <div>
        <span className="text-red-600">{error}</span>
      </div>

      <div className="w-full flex flex-col">
        {registerFields.map((field, index) => (
          <Input 
            type={field.type}
            name={field.name}
            label={field.label}
            required={field.required}
            placeholder={field.placeholder}
            key={index}
          />
        ))}
    </div>
          <button
            type="submit"
            className="m-2 bg-blue-500/95 py-2 px-4 rounded-md text-white w-full flex justify-center items-center gap-2"
          >
            Me connecter
            <FaSpinner className={`animate-spin ${!isLoading && 'text-transparent'}`}/>
            
          </button>

        <button
            onClick={AlreadySigned}
            className="mt-5"
          >
            Not signed in yet?
          </button>
      </form>
    );
}

export default RegisterForm;