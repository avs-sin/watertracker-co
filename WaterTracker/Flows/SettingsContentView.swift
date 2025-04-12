//
//  SettingsContentView.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import SwiftUI
import StoreKit
import MessageUI

/// Shows the main settings flow for the app
struct SettingsContentView: View {

    @EnvironmentObject var manager: DataManager

    // MARK: - Main rendering function
    var body: some View {
        ZStack {
            Color.background.ignoresSafeArea().onTapGesture {
                hideKeyboard()
            }
            VStack(spacing: 15) {
                CustomHeaderView
                ScrollView(showsIndicators: false) {
                    UserProfileHeaderView
                    DailyIntakeGoalSettings
                    VStack {
                        Divider().padding(.bottom)
                        if !manager.isPremiumUser {
                            InAppPurchasesSection
                        }
                        CustomHeader(title: "Spread the Word")
                        RatingShareView
                        CustomHeader(title: "Support & Privacy")
                        PrivacySupportView
                    }.padding(.horizontal)
                    Spacer(minLength: 20)
                }
            }
        }
    }

    /// Custom header view
    private var CustomHeaderView: some View {
        HStack {
            Text("Settings").font(.system(size: 24, weight: .semibold))
            Spacer()
            Button {
                if manager.dailyIntakeGoal == 0 {
                    presentAlert(title: "Daily Goal", message: "Your daily goal must be greater than zero", primaryAction: .OK)
                } else {
                    manager.fullScreenMode = nil
                }
            } label: {
                Image(systemName: "xmark").padding(8)
                    .font(.system(size: 15, weight: .semibold, design: .rounded))
                    .background(Circle().foregroundStyle(.secondaryBackground))
            }
        }.padding(.horizontal).padding(.top, 5)
    }

    /// User profile header view
    private var UserProfileHeaderView: some View {
        VStack {
            TextField("Username", text: $manager.username)
                .padding(10).padding(.horizontal, 5).background(
                    Color.secondaryBackground.cornerRadius(8)
                ).foregroundColor(.black).font(.system(size: 25, weight: .bold))
                .multilineTextAlignment(.center).padding(.horizontal)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 20) {
                    Spacer(minLength: -3)
                    ForEach(0..<AppConfig.avatars.count, id: \.self) { index in
                        Image(AppConfig.avatars[index])
                            .resizable().aspectRatio(contentMode: .fit)
                            .frame(width: 60, height: 60).background(
                                Color.accentColor.cornerRadius(15).opacity(0.2)
                            )
                            .opacity(manager.avatarName == AppConfig.avatars[index] ? 0.8 : 0.2)
                            .onTapGesture {
                                manager.avatarName = AppConfig.avatars[index]
                            }
                    }
                    Spacer(minLength: -3)
                }
            }.padding(.top, 10)
        }
    }

    /// Create custom header view
    private func CustomHeader(title: String) -> some View {
        HStack {
            Text(title).font(.system(size: 18, weight: .medium))
            Spacer()
        }.foregroundColor(.primaryText)
    }

    /// Custom settings item
    private func SettingsItem(title: String, icon: String,
                              action: @escaping() -> Void) -> some View {
        Button { action() } label: {
            HStack {
                Image(systemName: icon).resizable().aspectRatio(contentMode: .fit)
                    .frame(width: 22, height: 22, alignment: .center)
                Text(title).font(.system(size: 18))
                Spacer()
                Image(systemName: "chevron.right")
            }.foregroundColor(.primaryText).padding()
        }
    }

    // MARK: - Daily intake goal and fluid unit
    private var DailyIntakeGoalSettings: some View {
        VStack(spacing: 5) {
            HStack {
                Text("Daily Goal").font(.system(size: 18, weight: .medium))
                Spacer()
                HStack(spacing: 0) {
                    FluidUnitButton(type: .oz)
                    FluidUnitButton(type: .ml)
                }.frame(width: 80.0, height: 25).background(
                    Color.secondaryBackground.cornerRadius(8.0)
                )
            }.foregroundColor(.primaryText)
            let maxRange = manager.fluidUnits == FluidUnit.oz.rawValue ? 110.0 : 3100.0
            CustomSliderView(unit: manager.fluidUnits, maxRange: maxRange,
                             currentValue: manager.$dailyIntakeGoal)
        }.padding(.top, 10).padding(.horizontal)
    }

    /// Fluid unit button
    private func FluidUnitButton(type: FluidUnit) -> some View {
        let isSelected: Bool = manager.fluidUnits == type.rawValue
        return Button {
            manager.fluidUnits = type.rawValue
            manager.dailyIntakeGoal = 0
        } label: {
            ZStack {
                Color.accentColor.cornerRadius(8.0).opacity(isSelected ? 1 : 0)
                Text(type.rawValue).font(.system(size: 14))
                    .foregroundStyle(isSelected ? .white : .primaryText)
            }
        }
    }

    // MARK: - In App Purchases
    private var InAppPurchasesSection: some View {
        VStack {
            InAppPurchasesPromoBannerView
            CustomHeader(title: "In-App Purchases")
            InAppPurchasesView
        }
    }

    private var InAppPurchasesView: some View {
        VStack {
            SettingsItem(title: "Upgrade Premium", icon: "crown") {
                manager.fullScreenMode = .premium
            }
            Color.primaryText.frame(height: 1).padding(.horizontal).opacity(0.1)
            SettingsItem(title: "Restore Purchases", icon: "arrow.clockwise") {
                manager.fullScreenMode = .premium
            }
        }.padding([.top, .bottom], 5).background(
            Color.secondaryBackground.cornerRadius(15)
        ).padding(.bottom, 20)
    }

    private var InAppPurchasesPromoBannerView: some View {
        ZStack {
            if manager.isPremiumUser == false {
                ZStack {
                    LinearGradient(colors: [.accentColor, .accentColor.opacity(0.4)], startPoint: .topLeading, endPoint: .bottomTrailing)
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Premium Version").bold().font(.system(size: 20))
                            Text("- Unlimited Water Tracking").font(.system(size: 15)).opacity(0.7)
                            Text("- Unlock All Drink Types").font(.system(size: 15)).opacity(0.7)
                            Text("- Remove All Ads").font(.system(size: 15)).opacity(0.7)
                        }
                        Spacer()
                        Image(systemName: "crown.fill").font(.system(size: 45))
                    }.foregroundColor(.white).padding([.leading, .trailing], 20)
                }.frame(height: 110).cornerRadius(16).padding(.bottom, 15)
            }
        }
    }

    // MARK: - Rating and Share
    private var RatingShareView: some View {
        VStack {
            SettingsItem(title: "Rate App", icon: "star") {
                if let scene = windowScene {
                    SKStoreReviewController.requestReview(in: scene)
                }
            }
            Color.primaryText.frame(height: 1).padding(.horizontal).opacity(0.1)
            SettingsItem(title: "Share App", icon: "square.and.arrow.up") {
                let shareController = UIActivityViewController(activityItems: [AppConfig.yourAppURL], applicationActivities: nil)
                rootController?.present(shareController, animated: true, completion: nil)
            }
        }.padding([.top, .bottom], 5).background(
            Color.secondaryBackground.cornerRadius(15)
        ).padding(.bottom, 20)
    }

    // MARK: - Support & Privacy
    private var PrivacySupportView: some View {
        VStack {
            SettingsItem(title: "E-Mail us", icon: "envelope.badge") {
                EmailPresenter.shared.present()
            }
            Color.primaryText.frame(height: 1).padding(.horizontal).opacity(0.1)
            SettingsItem(title: "Privacy Policy", icon: "hand.raised") {
                UIApplication.shared.open(AppConfig.privacyURL, options: [:], completionHandler: nil)
            }
            Color.primaryText.frame(height: 1).padding(.horizontal).opacity(0.1)
            SettingsItem(title: "Terms of Use", icon: "doc.text") {
                UIApplication.shared.open(AppConfig.termsAndConditionsURL, options: [:], completionHandler: nil)
            }
        }.padding([.top, .bottom], 5).background(
            Color.secondaryBackground.cornerRadius(15)
        )
    }
}

// MARK: - Preview UI
#Preview {
    SettingsContentView().environmentObject(DataManager())
}

// MARK: - Mail presenter for SwiftUI
class EmailPresenter: NSObject, MFMailComposeViewControllerDelegate {
    public static let shared = EmailPresenter()
    private override init() { }

    func present() {
        if !MFMailComposeViewController.canSendMail() {
            presentAlert(title: "Email Client", message: "Your device must have the native iOS email app installed for this feature.", primaryAction: .OK)
            return
        }
        let picker = MFMailComposeViewController()
        picker.setToRecipients([AppConfig.emailSupport])
        picker.mailComposeDelegate = self
        rootController?.present(picker, animated: true, completion: nil)
    }

    func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
        rootController?.dismiss(animated: true, completion: nil)
    }
}
