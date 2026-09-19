import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, Phone } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'An unexpected issue occurred.' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('KinCare ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-[#2C241D]">
          <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border-3 border-[#EFE5D6] shadow-xl text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FEF2F2] border-2 border-[#FECACA] flex items-center justify-center text-[#B91C1C]">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif-warm text-2xl sm:text-3xl font-bold text-[#1E4D3B]">
                Everything is Safe
              </h1>
              <p className="text-base sm:text-lg text-[#665443] leading-relaxed">
                A small hiccup occurred, but your information, emergency contacts, and settings are completely protected.
              </p>
            </div>

            <div className="p-4 bg-[#EFF8F3] border-2 border-[#BDE7D1] rounded-2xl text-xs sm:text-sm text-[#1E4D3B] text-left flex items-center gap-3">
              <Phone className="w-5 h-5 shrink-0" />
              <span>
                Your guardian and emergency numbers remain on standby: <strong>(555) 234-5678</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-6 py-3.5 rounded-2xl bg-[#1E4D3B] text-white font-bold text-base hover:bg-[#143528] cursor-pointer shadow-sm btn-tactile flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Return to Safe Screen
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="px-6 py-3.5 rounded-2xl bg-[#F5EDE0] text-[#615140] font-bold text-base hover:bg-[#EAE0D0] cursor-pointer border border-[#E0D2BC] btn-tactile"
              >
                Refresh App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
