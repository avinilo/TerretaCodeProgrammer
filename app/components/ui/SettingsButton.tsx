import { memo } from 'react';
import { IconButton } from '~/components/ui/IconButton';
interface SettingsButtonProps {
  onClick: () => void;
}

export const SettingsButton = memo(({ onClick }: SettingsButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      icon="i-ph:gear"
      size="xl"
      title="Settings"
      className="text-[#666] hover:text-Terretacode-elements-textPrimary hover:bg-Terretacode-elements-item-backgroundActive/10 transition-colors"
    />
  );
});
