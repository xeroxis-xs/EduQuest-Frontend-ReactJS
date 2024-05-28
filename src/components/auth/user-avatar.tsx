// src/components/auth/user-avatar.tsx

import * as React from 'react';
import {NameInitialsAvatar} from "react-name-initials-avatar";

// import { useUser } from '@/hooks/use-user';
// import { extractInitials } from '@/app/msal/user-helper';

export interface UserAvatarProps {
  name: string,
  bgColor?: string,
  textColor?: string,
  size?: string,
  borderRadius?: string,
  textWeight?: string,
  textSize?: string,
  borderColor?: string,
  borderStyle?: string,
  borderWidth?: string,
  props?: UserAvatarProps
}

export function UserAvatar(props: UserAvatarProps): React.JSX.Element {

  return (
    <div className="user-profile">
      <NameInitialsAvatar
        {...props}
      />
    </div>
  );
}
