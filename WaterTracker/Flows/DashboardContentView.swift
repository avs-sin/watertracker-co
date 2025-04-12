//
//  DashboardContentView.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import TipKit
import SwiftUI

/// Main dashboard for the app
struct DashboardContentView: View {

    @EnvironmentObject var manager: DataManager
    @State private var disableSubmitButton: Bool = false

    // MARK: - Main rendering function
    var body: some View {
        ZStack {
            Color.background.ignoresSafeArea()
            VStack(spacing: 20) {
                CustomHeaderView
                IntakeProgressView().environmentObject(manager)
                DrinkSelectorView
                IntakeSliderView
                SubmitButton
            }.padding()
        }
        /// Show full screen flows
        .fullScreenCover(item: $manager.fullScreenMode) { type in
            switch type {
            case .drinks: DrinksContentView().environmentObject(manager)
            case .settings: SettingsContentView().environmentObject(manager)
            case .history: HistoryContentView().environmentObject(manager)
            case .premium: PremiumView
            }
        }
    }

    /// Custom header view
    private var CustomHeaderView: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(manager.greetingText).font(.system(size: 24, weight: .semibold))
                Text(manager.username)
            }
            Spacer()
            Image(manager.avatarName).resizable().aspectRatio(contentMode: .fill)
                .frame(width: 50, height: 50).background(Color.secondaryBackground)
                .mask(Circle()).popoverTip(GetStartedTip())
                .onTapGesture { manager.fullScreenMode = .settings }
        }
    }

    /// Drink selector view
    private var DrinkSelectorView: some View {
        let padding: Double = !UIDevice.current.hasNotch ? 10.0 : 20.0
        return HStack(spacing: 10) {
            ForEach(0..<min(manager.commonDrinks.count, 3), id: \.self) { index in
                Button {
                    manager.selectedDrink = manager.commonDrinks[index]
                } label: {
                    DrinkTypeButton(type: manager.commonDrinks[index],
                                    fontSize: 14, iconSize: 30,
                                    cornerRadius: 15, lineWidth: 5, padding: padding,
                                    selected: manager.selectedDrink == manager.commonDrinks[index])
                }
            }
            Button {
                manager.fullScreenMode = .drinks
            } label: {
                DrinkTypeButton(type: nil, fontSize: 15, iconSize: 30, cornerRadius: 15,
                                lineWidth: 5, padding: padding, selected: false)
            }
        }
    }

    /// Drink intake slider view
    private var IntakeSliderView: some View {
        let maxRange = manager.fluidUnits == FluidUnit.oz.rawValue ? 16.0 : 450
        return CustomSliderView(unit: manager.fluidUnits, maxRange: maxRange,
                                currentValue: manager.$intakeAmount)
    }

    /// Submit drink intake button
    private var SubmitButton: some View {
        Button {
            if manager.intakeAmount <= 0 {
                presentAlert(title: "Hmm...", message: "You cannot track 0 \(manager.fluidUnits) intake", primaryAction: .OK)
            } else {
                disableSubmitButton = true
                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                    self.disableSubmitButton = false
                    self.manager.submitDrink()
                }
            }
        } label: {
            ZStack {
                Color.accentColor.cornerRadius(14.0)
                Text(disableSubmitButton ? "submitting..." : "Submit").foregroundStyle(.white)
            }
        }
        .frame(height: 50).disabled(disableSubmitButton)
        .padding(.bottom, !UIDevice.current.hasNotch ? 15.0 : 0.0)
    }

    /// Premium flow view
    private var PremiumView: some View {
        PremiumContentView(title: "Premium Version", subtitle: "Unlock All Features", features: ["Unlimited Water Tracking", "Unlock All Drink Types", "Remove All Ads"], productIds: [AppConfig.premiumVersion]) {
            manager.fullScreenMode = nil
        } completion: { _, status, _ in
            DispatchQueue.main.async {
                if status == .success || status == .restored {
                    manager.isPremiumUser = true
                    Interstitial.shared.isPremiumUser = true
                }
                manager.fullScreenMode = nil
            }
        }
    }
}

// MARK: - Preview UI
#Preview {
    let manager = DataManager()
    manager.dailyIntakeGoal = 104.0
    manager.todayIntakeAmount = 75.0
    manager.drinksData = chartPreviewData
    return DashboardContentView().environmentObject(manager)
}
