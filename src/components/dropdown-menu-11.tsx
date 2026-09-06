'use client';

import React, { useState } from 'react';
import {
  FaBell,
  FaBellSlash,
  FaVolumeLow,
  FaVolumeHigh,
  FaVolumeXmark,
} from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface DropdownMenuItem11 {
  value: string;
  label: string;
  icon?: React.ElementType;
  color?: string;
}

export interface DropdownMenu11Props {
  trigger?: React.ReactNode;
  label?: string;
  items?: DropdownMenuItem11[];
  selected?: string;
  onSelect?: (value: string) => void;
  align?: 'start' | 'center' | 'end';
}

const defaultLevels: DropdownMenuItem11[] = [
  {
    value: 'all',
    label: 'All Notifications',
    icon: FaBell,
    color: 'text-emerald-500',
  },
  {
    value: 'important',
    label: 'Important Only',
    icon: FaVolumeHigh,
    color: 'text-amber-500',
  },
  {
    value: 'mentions',
    label: 'Mentions Only',
    icon: FaVolumeLow,
    color: 'text-blue-500',
  },
  {
    value: 'silent',
    label: 'Silent Mode',
    icon: FaVolumeXmark,
    color: 'text-slate-400',
  },
  {
    value: 'off',
    label: 'Turn Off',
    icon: FaBellSlash,
    color: 'text-rose-500',
  },
];

export const DropdownMenu11 = ({
  trigger,
  label = 'Notification Level',
  items = defaultLevels,
  selected: externalSelected,
  onSelect,
  align = 'end',
}: DropdownMenu11Props) => {
  const [internalSelected, setInternalSelected] = useState('all');
  const selected = externalSelected !== undefined ? externalSelected : internalSelected;

  const handleSelect = (value: string) => {
    setInternalSelected(value);
    if (onSelect) onSelect(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline" className="rounded-xl font-semibold border-slate-200 hover:bg-slate-50 transition cursor-pointer">
            Notifications
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-white/95 backdrop-blur-md sm:w-64 w-56 rounded-2xl border border-slate-200/80 p-1.5 shadow-xl shadow-slate-900/10 z-50"
        align={align}
      >
        {label && (
          <DropdownMenuLabel className="px-2.5 pt-1.5 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            {label}
          </DropdownMenuLabel>
        )}

        <DropdownMenuGroup className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = selected === item.value;

            return (
              <DropdownMenuItem
                key={item.value}
                onClick={() => handleSelect(item.value)}
                className={`group flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all outline-none ${
                  active
                    ? 'bg-slate-100/90 text-slate-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {Icon && (
                  <Icon
                    className={`${item.color || 'text-slate-500'} text-sm shrink-0 transition-transform duration-200 ${
                      active ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  />
                )}

                <span className="flex-1 truncate">{item.label}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenu11;
