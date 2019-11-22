import { FunctionComponent, h } from 'preact';
import styles from './styles.less';
import cn from 'classnames';

interface IProps {
    className?: string
    onClick?: () => void
    range?: string
}


const TicketMany = ({className, onClick, range}: IProps) => <div style={{cursor: onClick ? 'pointer' : 'inherit'}}
                                                      onClick={onClick} className={cn(styles.ticket, className)}>
    {range && <div class={styles.text}>{range}</div>}
    <svg style={{position: 'relative', top: '-4px'}} width="176" height="131" viewBox="0 0 176 131" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1355 57.6778C7.09008 59.9241 4.82102 65.8352 7.06737 70.8806L12.5329 83.1563C19.6279 79.9974 27.9404 83.1883 31.0994 90.2833C34.2583 97.3784 31.0674 105.691 23.9724 108.85L29.4379 121.126C31.6842 126.171 37.5953 128.44 42.6407 126.194L161.402 73.3179C166.447 71.0716 168.716 65.1605 166.47 60.1151L161.004 47.8393C153.909 50.9982 145.597 47.8074 142.438 40.7123C139.279 33.6173 142.47 25.3048 149.565 22.1458L144.099 9.87008C141.853 4.8247 135.942 2.55564 130.896 4.80199L12.1355 57.6778Z" fill="url(#paint0_linear)"/>
        <g filter="url(#filter0_d)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.95 47.3672C9.64112 48.8895 6.57147 54.4272 8.09378 59.7362L11.7977 72.6531C19.2633 70.5124 27.0508 74.8291 29.1915 82.2947C31.3323 89.7603 27.0156 97.5479 19.55 99.6886L23.2538 112.606C24.7761 117.914 30.3139 120.984 35.6228 119.462L160.587 83.6289C165.896 82.1066 168.965 76.5688 167.443 71.2599L163.739 58.343C156.274 60.4837 148.486 56.167 146.345 48.7014C144.205 41.2358 148.521 33.4482 155.987 31.3075L152.283 18.3905C150.761 13.0816 145.223 10.012 139.914 11.5343L14.95 47.3672Z" fill="url(#paint1_linear)"/>
        </g>
        <g filter="url(#filter1_d)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0243 39.41C14.5552 40.1787 10.7447 45.2353 11.5133 50.7044L13.3835 64.0112C21.0744 62.9303 28.1853 68.2888 29.2662 75.9797C30.3471 83.6706 24.9886 90.7816 17.2977 91.8625L19.1678 105.169C19.9365 110.638 24.9931 114.449 30.4622 113.68L159.197 95.5876C164.666 94.819 168.477 89.7623 167.708 84.2932L165.838 70.9865C158.147 72.0674 151.036 66.7089 149.955 59.018C148.874 51.327 154.233 44.2161 161.924 43.1352L160.054 29.8285C159.285 24.3594 154.228 20.5489 148.759 21.3175L20.0243 39.41Z" fill="url(#paint2_linear)"/>
        </g>
        <g filter="url(#filter2_d)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M25.6108 29.9993C20.088 29.9993 15.6108 34.4764 15.6108 39.9993V53.4368C23.3773 53.4368 29.6733 59.7328 29.6733 67.4993C29.6733 75.2658 23.3773 81.5618 15.6108 81.5618V94.9993C15.6108 100.522 20.088 104.999 25.6108 104.999H155.611C161.134 104.999 165.611 100.522 165.611 94.9993V81.5618C157.844 81.5618 151.548 75.2658 151.548 67.4993C151.548 59.7328 157.844 53.4368 165.611 53.4368V39.9993C165.611 34.4764 161.134 29.9993 155.611 29.9993H25.6108Z" fill="url(#paint3_linear)"/>
        </g>
        <line x1="29.4565" y1="30.6531" x2="151.764" y2="30.6531" stroke="url(#paint4_linear)"/>
        <line opacity="0.7" x1="29.4565" y1="104.499" x2="151.764" y2="104.499" stroke="url(#paint5_linear)"/>
        <defs>
            <filter id="filter0_d" x="0.337402" y="5.77783" width="174.862" height="123.44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                <feOffset dy="2"/>
                <feGaussianBlur stdDeviation="2.5"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.0784314 0 0 0 0 0.0117647 0 0 0 0 0.345098 0 0 0 0.5 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </filter>
            <filter id="filter1_d" x="5.12158" y="16.9258" width="168.978" height="105.146" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                <feOffset dy="2"/>
                <feGaussianBlur stdDeviation="2.5"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.0784314 0 0 0 0 0.0117647 0 0 0 0 0.345098 0 0 0 0.5 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </filter>
            <filter id="filter2_d" x="10.6108" y="26.9993" width="160" height="85" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                <feOffset dy="2"/>
                <feGaussianBlur stdDeviation="2.5"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.0787249 0 0 0 0 0.0115278 0 0 0 0 0.345833 0 0 0 0.5 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </filter>
            <linearGradient id="paint0_linear" x1="140.032" y1="0.73462" x2="170.537" y2="69.2505" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FDED8D"/>
                <stop offset="1" stop-color="#FFD046"/>
            </linearGradient>
            <linearGradient id="paint1_linear" x1="149.527" y1="8.77793" x2="170.199" y2="80.8726" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FDED8D"/>
                <stop offset="1" stop-color="#FFD046"/>
            </linearGradient>
            <linearGradient id="paint2_linear" x1="158.662" y1="19.9258" x2="169.1" y2="94.1959" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FDED8D"/>
                <stop offset="1" stop-color="#FFD046"/>
            </linearGradient>
            <linearGradient id="paint3_linear" x1="165.611" y1="29.9993" x2="165.611" y2="104.999" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FDED8D"/>
                <stop offset="1" stop-color="#FFD046"/>
            </linearGradient>
            <linearGradient id="paint4_linear" x1="151.764" y1="30.1529" x2="29.455" y2="30.8949" gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0"/>
                <stop offset="0.276042" stop-color="white"/>
                <stop offset="0.708333" stop-color="white"/>
                <stop offset="1" stop-color="white" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="paint5_linear" x1="151.764" y1="103.999" x2="29.455" y2="104.741" gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0"/>
                <stop offset="0.276042" stop-color="white"/>
                <stop offset="0.708333" stop-color="white"/>
                <stop offset="1" stop-color="white" stop-opacity="0"/>
            </linearGradient>
        </defs>
    </svg>
</div>;

export default TicketMany;
