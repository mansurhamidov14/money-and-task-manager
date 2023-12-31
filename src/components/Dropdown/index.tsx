import { ParentProps, Show, createContext, createSignal, mergeProps, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import { DropdownContextType, DropdownProps } from "./types";
import "./style.css";

export * from "./DropdownMenu";
export * from "./DropdownItem";
export * from "./DropdownToggleButton";

const DropdownContext = createContext<DropdownContextType>();

export function useDropdown() {
  return useContext(DropdownContext);
}

export function Dropdown(props: ParentProps<DropdownProps>) {
  const [isOpen, setIsOpen] = createSignal(false);
  const defaultProps: Pick<
    Required<DropdownProps>,
    "horizontalPlacement" | "verticalPlacement" | "overlayZIndex"
  > = { horizontalPlacement: "left", verticalPlacement: "bottom", overlayZIndex: 11 };
  const finalProps = mergeProps(defaultProps, props);

  return (
    <DropdownContext.Provider value={{
      isOpen,
      setIsOpen,
      id: finalProps.id,
      horizontalPlacement: finalProps.horizontalPlacement,
      verticalPlacement: finalProps.verticalPlacement,
      onOpen: finalProps.onOpen,
      onClose: finalProps.onClose,
      overlayZIndex: finalProps.overlayZIndex
    }}>
      <Show when={finalProps.hasOverlay && isOpen()}>
        <Portal>
          <div class="dropdown-overlay" style={`z-index: ${finalProps.overlayZIndex}`}></div>
        </Portal>
      </Show>
      <div classList={{ "inline-flex": true, open: isOpen() }}>
        {props.children}
      </div>
    </DropdownContext.Provider>
  );
}

