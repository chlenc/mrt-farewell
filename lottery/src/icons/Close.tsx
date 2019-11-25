import { FunctionComponent, h } from 'preact';

interface IProps {
    className?: string
    onClick?: () => void
}

const Close = ({className, onClick}: IProps) => <div style={{cursor: onClick ? 'pointer' : 'inherit'}}
                                                         onClick={onClick} className={className}>
    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M51.3241 17.383L17.383 51.3241M50.617 51.3241L16.6759 17.383" stroke="white"/>
    </svg>

</div>;

export default Close;
