import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StarBorderProps<E extends ElementType> = {
  as?: E
  className?: string
  color?: string
  speed?: string
  thickness?: number
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'className' | 'children'>

export function StarBorder<E extends ElementType = 'button'>({
  as,
  className,
  color = 'white',
  speed = '6s',
  thickness = 2,
  children,
  ...rest
}: StarBorderProps<E>) {
  const Comp = (as ?? 'button') as ElementType
  return (
    <Comp
      className="relative inline-block overflow-hidden rounded-xl bg-transparent border-0 cursor-pointer no-underline"
      style={{ padding: `${thickness}px` }}
      {...rest}
    >
      <div
        className="absolute w-[300%] h-full opacity-100 -bottom-[20%] -right-[250%] rounded-[50%] z-0 animate-star-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute w-[300%] h-full opacity-100 -top-[20%] -left-[250%] rounded-[50%] z-0 animate-star-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          'relative z-[1] w-full h-full flex items-center justify-center rounded-[10px]',
          className,
        )}
      >
        {children}
      </div>
    </Comp>
  )
}
