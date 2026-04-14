'use client';

import React, { useState, memo } from 'react';
import Image from 'next/image';
import classes from './Accordion.module.scss';

export interface AccordionItemData {
  id: number;
  question: string;
  answer: string;
  iconSrc?: string; 
  iconAlt?: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  /** Вариант оформления (например страница FAQ в общем контейнере как новости) */
  variant?: 'default' | 'faq';
}

const Accordion: React.FC<AccordionProps> = ({ items, variant = 'default' }) => {
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenItemId(prevId => (prevId === id ? null : id));
  };

  const rootClass =
    variant === 'faq'
      ? `${classes.accordionContainer} ${classes.faqVariant}`
      : classes.accordionContainer;

  return (
    <div className={rootClass}>
      {items.map((item) => {
        const isOpen = item.id === openItemId;
        const displayId = item.id < 10 ? `0${item.id}` : item.id.toString();

        return (
          <div
            key={item.id}
            className={`${classes.item} ${isOpen ? classes.itemExpanded : ''}`}
          >
            
            <button 
              className={classes.header} 
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
            >
              <div className={classes.questionContent}>
                <span className={classes.itemNumber}>{displayId}</span>
                <span className={classes.questionText}>{item.question}</span>
              </div>

              <div className={classes.iconWrapper}>
                {item.iconSrc && (
                  <Image 
                    src={item.iconSrc} 
                    alt={item.iconAlt || item.question}
                    width={18}
                    height={18}
                    className={classes.itemIcon}
                  />
                )}
                
                <span
                  className={`${classes.toggleIcon} ${isOpen ? classes.open : ''}`}
                  aria-hidden
                >
                  <svg
                    className={classes.toggleSvg}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            </button>

            <div 
              className={`${classes.content} ${isOpen ? classes.contentOpen : ''}`} 
              aria-hidden={!isOpen}
            >
              <div 
                className={classes.answerText}
                dangerouslySetInnerHTML={{ __html: item.answer.replace(/\n/g, '<br/>') }}
              />
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default memo(Accordion);