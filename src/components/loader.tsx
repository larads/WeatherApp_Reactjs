import { ImSpinner8 } from 'react-icons/im';

export function Loader() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <ImSpinner8 className="text-5xl animate-spin text-white" />
        </div>
    );
}
