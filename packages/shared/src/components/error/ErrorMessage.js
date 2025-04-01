import charError from './error.gif';

export function ErrorMessage() {
    return (
        <img src={charError} alt='error' style={{height: '180px', margin: '0 auto'}} />
    );
}