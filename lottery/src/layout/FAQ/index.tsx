import { h, FunctionComponent, Fragment } from 'preact';
import Close from '@src/icons/Close';
import styles from './styles.less';

interface IProps {
    onClose: () => void
}

const items: { question: string, answer: string }[] = [
    {question: 'Example question', answer: 'Example answer'}
];

const FAQ: FunctionComponent<IProps> = ({onClose}) => <div class={styles.root}>
    <Close className={styles.close} onClick={onClose}/>
    <div class={styles.overlay}>
        <div class={styles.header}>FAQ</div>
        <div class={styles.content}>
            {items.map(({question, answer}, i) => <Fragment>
                    <div class={styles.question}>{`${i + 1}. ${question}`}</div>
                    <div class={styles.answer}>{answer}</div>
                </Fragment>
            )}
        </div>
    </div>
</div>;
export default FAQ;
