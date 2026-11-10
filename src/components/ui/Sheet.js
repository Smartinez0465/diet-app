import { Modal, Pressable, View } from "react-native";
import { useTheme } from "../../theme";
import Text from "./Text";

/**
 * Bottom sheet modal for confirmations, pickers and quick-add flows.
 * <Sheet visible onClose title="Delete entry?">...children (Buttons)...</Sheet>
 * Spec: scrim = theme.overlay, tap scrim or Android back to dismiss, 24px top radius,
 * grab handle, content padded 20px. For full-screen flows (barcode scanner) keep using
 * <Modal presentationStyle="fullScreen"> directly and overlay a <Button>.
 */
export default function Sheet({ visible, onClose, title, children }) {
  const { colors, radii, spacing } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: colors.overlay }}
        onPress={onClose}
        accessibilityLabel="Close"
      />
      <View
        style={{
          backgroundColor: colors.surface,
          borderTopLeftRadius: radii.xl,
          borderTopRightRadius: radii.xl,
          padding: spacing.xl,
          paddingBottom: spacing.xxxl
        }}
      >
        <View
          style={{
            alignSelf: "center",
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.border,
            marginBottom: spacing.lg
          }}
        />
        {title ? (
          <Text variant="h2" style={{ marginBottom: spacing.md }}>
            {title}
          </Text>
        ) : null}
        {children}
      </View>
    </Modal>
  );
}
